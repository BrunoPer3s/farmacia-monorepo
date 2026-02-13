const express = require('express');
const router = express.Router();
const db = require('./db');
const {apenasAdmin, autenticado} = require('./middleware');

router.get('/', apenasAdmin, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE role = "client"');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar clientes' });
    }
});

router.post('/', apenasAdmin, async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    try {
        const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "client")';
        const [result] = await db.query(sql, [name, email, password]);
        
        res.status(201).json({ 
            id: result.insertId, 
            name, 
            email 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
});

router.put('/:id', apenasAdmin, async (req, res) => {
    const { name, email } = req.body;
    const { id } = req.params;

    try {
        const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "client"';
        const [result] = await db.query(sql, [name, email, id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
        
        res.json({ message: 'Cliente atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
});

router.delete('/:id', apenasAdmin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ? AND role = "client"', [req.params.id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cliente não encontrado' });

        res.json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar cliente' });
    }
});

module.exports = router;