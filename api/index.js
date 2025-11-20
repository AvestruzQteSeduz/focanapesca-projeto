// api/index.js
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const prisma = new PrismaClient();
const saltRounds = 10;
const JWT_SECRET = "FOCANAPESCA_SEGREDO_SUPER_SEGURO_123";

app.use(cors());
app.use(express.json());

// --- MIDDLEWARES ---

// Middleware para verificar se é Admin
const checkAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado: Apenas Admin.' });
    }
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

// Middleware apenas para verificar se está logado (Qualquer usuário)
const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload; // Salva os dados do usuário (ID, email) na requisição
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};


// --- ROTAS DE TESTE ---
app.get('/', (req, res) => {
  res.send('Olá! A API da Foca na Pesca está no ar!');
});

// --- ROTAS DE USUÁRIO ---

app.post('/usuarios/cadastro', async (req, res) => {
  const { email, nome, senha, cpf, rg, cep, rua, numero, bairro, cidade, estado } = req.body;

  if (!email || !nome || !senha || !cpf || !cep) {
    return res.status(400).json({ error: 'Dados essenciais ausentes.' });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const novoUsuario = await prisma.usuario.create({
      data: { email, nome, senha: senhaHash, cpf, rg, cep, rua, numero, bairro, cidade, estado },
    });

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: `Conflito: ${error.meta.target.join(', ')} já está em uso.` });
    }
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao criar usuário.' });
  }
});

app.post('/usuarios/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) return res.status(400).json({ error: 'Email e senha obrigatórios.' });

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: 'Email ou senha inválidos.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(401).json({ error: 'Email ou senha inválidos.' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login ok!', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
});

// --- ROTAS DE PRODUTOS ---

app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();
    res.status(200).json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

app.get('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const produto = await prisma.produto.findUnique({ where: { id: parseInt(id) } });
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' });
    res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o produto.' });
  }
});

// Rotas Protegidas de Produto (Admin)
app.post('/produtos', checkAdmin, async (req, res) => {
  const { nome, descricao, preco, estoque, imagemUrl } = req.body;
  try {
    const novoProduto = await prisma.produto.create({
      data: {
        nome, descricao, imagemUrl,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
      },
    });
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar produto.' });
  }
});

app.put('/produtos/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque, imagemUrl } = req.body;
  try {
    const produtoAtualizado = await prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        nome, descricao, imagemUrl,
        preco: preco ? parseFloat(preco) : undefined,
        estoque: estoque ? parseInt(estoque) : undefined,
      },
    });
    res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
});

app.delete('/produtos/:id', checkAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produto.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar produto.' });
  }
});

// --- ROTA DE PEDIDOS (AQUI ESTAVA O PROBLEMA PROVÁVEL) ---

app.post('/pedidos', checkAuth, async (req, res) => {
  const { itens, total, frete, endereco, metodoPagamento } = req.body;
  const usuarioId = req.usuario.id;

  console.log("Recebendo pedido...", { usuarioId, total, itens }); // Log para debug

  try {
    const novoPedido = await prisma.pedido.create({
      data: {
        usuarioId: usuarioId,
        total: parseFloat(total), // Garante que é número
        frete: parseFloat(frete), // Garante que é número
        status: 'PAGO',
        itens: {
          create: itens.map(item => ({
            produtoId: parseInt(item.id), // <--- A CORREÇÃO CRÍTICA (Inteiro)
            quantidade: parseInt(item.quantidadePedido), // Inteiro
            precoUnitario: parseFloat(item.preco) // Float
          }))
        }
      }
    });

    console.log("Pedido criado com sucesso ID:", novoPedido.id);
    res.status(201).json(novoPedido);

  } catch (error) {
    console.error("ERRO AO CRIAR PEDIDO:", error); // Log detalhado
    res.status(500).json({ error: 'Erro ao processar pedido.' });
  }
});

app.get('/pedidos/meus-pedidos', checkAuth, async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId: usuarioId // Filtra pelo ID do usuário do token
      },
      include: {
        // Inclui os itens do pedido e os detalhes do produto
        itens: {
          include: {
            produto: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Mostra os mais recentes primeiro
      }
    });

    res.json(pedidos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});