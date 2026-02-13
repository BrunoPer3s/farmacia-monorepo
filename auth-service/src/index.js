const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Autenticação (JWT) Online 🔐" });
});

app.listen(PORT, () => {
    console.log(`Serviço de Auth rodando na porta ${PORT}`);
});