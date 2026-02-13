const request = require('supertest');
const express = require('express');
const clientRoutes = require('../src/routes');

jest.mock('../src/db', () => ({
    query: jest.fn(() => Promise.resolve([
        [{ id: 1, name: 'Cliente Teste', email: 'cliente@teste.com', role: 'client' }] 
    ]))
}));

const app = express();
app.use(express.json());
app.use('/clients', clientRoutes);

describe('GET /clients', () => {
    it('Deve retornar uma lista de clientes', async () => {
        const res = await request(app).get('/clients');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body[0].email).toEqual('cliente@teste.com');
    });
});