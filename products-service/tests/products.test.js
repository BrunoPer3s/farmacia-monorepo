const request = require('supertest');
const express = require('express');
const productRoutes = require('../src/routes');
const jwt = require('jsonwebtoken');

jest.mock('../src/db', () => ({
    query: jest.fn(() => Promise.resolve([
        { insertId: 1, affectedRows: 1 },
        undefined
    ]))
}));

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Testes de Integração - Produtos', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET / - Deve retornar lista se for Cliente', async () => {
        jwt.verify.mockReturnValue({ role: 'client' }); 

        require('../src/db').query.mockResolvedValueOnce([[{ id: 1, name: 'Produto Teste' }]]);

        const res = await request(app)
            .get('/products')
            .set('Authorization', 'Bearer token_falso');

        expect(res.statusCode).toEqual(200);
        expect(res.body[0].name).toEqual('Produto Teste');
    });

    it('GET / - Deve negar acesso sem token', async () => {
        const res = await request(app).get('/products');
        expect(res.statusCode).toEqual(401);
    });

    
    it('POST / - Deve negar criação se for Cliente', async () => {
        jwt.verify.mockReturnValue({ role: 'client' });

        const res = await request(app)
            .post('/products')
            .set('Authorization', 'Bearer token_falso')
            .send({ name: 'Produto Proibido', price: 10 });

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error');
    });

    it('POST / - Deve permitir criação se for Admin', async () => {
        jwt.verify.mockReturnValue({ role: 'admin' });

        const res = await request(app)
            .post('/products')
            .set('Authorization', 'Bearer token_falso')
            .send({ name: 'Produto Novo', price: 10 });

        expect(res.statusCode).toEqual(201);
    });

    it('DELETE /:id - Deve permitir deleção se for Admin', async () => {
        jwt.verify.mockReturnValue({ role: 'admin' });

        const res = await request(app)
            .delete('/products/1')
            .set('Authorization', 'Bearer token_falso');

        expect(res.statusCode).toEqual(200);
    });
});