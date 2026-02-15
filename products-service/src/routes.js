const express = require('express');
const router = express.Router();
const db = require('./db');
const {apenasAdmin, autenticado} = require('./middleware');

router.get('/', autenticado, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

router.get('/:id', autenticado, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

router.post('/', apenasAdmin, async (req, res) => {
    const { name, description, price, quantity, image_url} = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Nome e Preço são obrigatórios' });
    }

    try {
        const sql = 'INSERT INTO products (name, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [name, description, price, quantity, image_url]);
        
        res.status(201).json({ 
            id: result.insertId, 
            name, 
            price 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

router.put('/:id', apenasAdmin, async (req, res) => {
    const { name, price, quantity } = req.body;
    const { id } = req.params;

    try {
        const sql = 'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?';
        const [result] = await db.query(sql, [name, price, quantity, id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

router.delete('/:id', apenasAdmin, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });

        res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;