const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clientRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/clients', clientRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Clientes Online 👥" });
});

app.listen(PORT, () => {
    console.log(`Serviço de Clientes rodando na porta ${PORT}`);
});