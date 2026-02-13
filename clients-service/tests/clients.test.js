const request = require('supertest');
const express = require('express');
const clientRoutes = require('../src/routes');
const jwt = require('jsonwebtoken');

jest.mock('../src/db', () => ({
    query: jest.fn(() => Promise.resolve([
        { insertId: 1, affectedRows: 1 },
        undefined
    ]))
}));

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
    decode: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/clients', clientRoutes);

describe('Testes de Integração - Clientes', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    });

    it('GET / - Deve negar acesso a um Cliente comum', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'client' }));

        const res = await request(app)
            .get('/clients')
            .set('Authorization', 'Bearer token_falso');

        expect(res.statusCode).toEqual(403);
    });

    
    it('GET / - Deve listar clientes se for Admin', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'admin' }));
        
        const db = require('../src/db');
        db.query.mockResolvedValueOnce([[{ id: 1, name: 'Cliente Teste' }]]);

        const res = await request(app)
            .get('/clients')
            .set('Authorization', 'Bearer token_falso');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('POST / - Deve criar cliente se for Admin', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'admin' }));

        const res = await request(app)
            .post('/clients')
            .set('Authorization', 'Bearer token_falso')
            .send({ name: 'Novo User', email: 'a@a.com', password: '123' });

        expect(res.statusCode).toEqual(201);
    });

    it('DELETE /:id - Deve deletar cliente se for Admin', async () => {
        jwt.verify.mockImplementation(() => ({ role: 'admin' }));

        const res = await request(app)
            .delete('/clients/1')
            .set('Authorization', 'Bearer token_falso');

        expect(res.statusCode).toEqual(200);
    });
});