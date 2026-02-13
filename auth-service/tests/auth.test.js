const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../src/db', () => ({
    query: jest.fn()
}));
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Testes de Autenticação', () => {

    it('POST /register - Deve criar um usuário novo', async () => {
        require('../src/db').query.mockResolvedValueOnce([[]]); 
        require('../src/db').query.mockResolvedValueOnce([{ insertId: 1 }]); 
        
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashed_password');

        const res = await request(app)
            .post('/auth/register')
            .send({ name: 'Teste', email: 'novo@teste.com', password: '123' });

        expect(res.statusCode).toEqual(201);
    });

    it('POST /register - Deve falhar se email já existe', async () => {
        require('../src/db').query.mockResolvedValueOnce([[{ id: 1, email: 'existe@teste.com' }]]);

        const res = await request(app)
            .post('/auth/register')
            .send({ name: 'Teste', email: 'existe@teste.com', password: '123' });

        expect(res.statusCode).toEqual(400);
    });

    it('POST /login - Deve retornar token se credenciais válidas', async () => {
        require('../src/db').query.mockResolvedValueOnce([[{ 
            id: 1, 
            email: 'admin@teste.com', 
            password: 'hash_do_banco', 
            role: 'admin' 
        }]]);

        bcrypt.compare.mockResolvedValue(true); 

        jwt.sign.mockReturnValue('token_jwt_falso');

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'admin@teste.com', password: '123' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token', 'token_jwt_falso');
        expect(res.body.user.role).toEqual('admin');
    });
});