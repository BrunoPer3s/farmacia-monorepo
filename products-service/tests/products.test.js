const request = require('supertest');
const express = require('express');
const productRoutes = require('../src/routes');

jest.mock('../src/db', () => ({
    query: jest.fn(() => Promise.resolve([
        [{ id: 1, name: 'Dipirona Teste', price: 5.00 }]
    ]))
}));

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('GET /products', () => {
    it('Deve retornar uma lista de produtos com status 200', async () => {
        const res = await request(app).get('/products');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].name).toEqual('Dipirona Teste');
    });
});