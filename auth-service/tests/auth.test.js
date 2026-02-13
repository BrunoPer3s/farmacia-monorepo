const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes');

jest.mock('../src/db', () => ({
    query: jest.fn(() => Promise.resolve([
        [{ 
            id: 1, 
            name: 'Admin Teste', 
            email: 'admin@teste.com', 
            password: 'senha_hash_falsa', 
            role: 'admin' 
        }] 
    ]))
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(() => Promise.resolve(true)),
    genSalt: jest.fn(() => Promise.resolve('salt')),
    hash: jest.fn(() => Promise.resolve('hash_criado'))
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'token_falso_gerado_pelo_jest')
}));

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('POST /auth/login', () => {
    it('Deve autenticar e retornar um token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@teste.com',
                password: 'senha_qualquer'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.token).toEqual('token_falso_gerado_pelo_jest');
    });
});