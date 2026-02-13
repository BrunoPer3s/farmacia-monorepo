const express = require('express');
const router = express.Router();
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    try {
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role === 'admin' ? 'admin' : 'client';
        
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        await db.query(sql, [name, email, hashedPassword, userRole]);

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name }, // Payload (dados dentro do token)
            process.env.JWT_SECRET || 'segredo',              // Chave secreta
            { expiresIn: '1h' }                               // Expira em 1 hora
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

module.exports = router;