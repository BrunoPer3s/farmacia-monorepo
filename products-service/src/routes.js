const express = require('express');
const router = express.Router();
const db = require('./db');
const verificarToken = require('./middleware');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

router.post('/', verificarToken, async (req, res) => {
    const { name, laboratory, price, stock_quantity, description } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Nome e Preço são obrigatórios' });
    }

    try {
        const sql = 'INSERT INTO products (name, laboratory, price, stock_quantity, description) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [name, laboratory, price, stock_quantity, description]);
        
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

router.put('/:id', verificarToken, async (req, res) => {
    const { name, price, stock_quantity } = req.body;
    const { id } = req.params;

    try {
        const sql = 'UPDATE products SET name = ?, price = ?, stock_quantity = ? WHERE id = ?';
        const [result] = await db.query(sql, [name, price, stock_quantity, id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });
        
        res.json({ message: 'Produto atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
});

router.delete('/:id', verificarToken, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });

        res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

module.exports = router;