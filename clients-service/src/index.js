const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');

const clientRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());

try {
    const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/clients/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.error("Erro ao carregar Swagger:", error.message);
}

app.use(express.json());

app.use('/clients', clientRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Clientes Online 👥" });
});

app.listen(PORT, () => {
    console.log(`Serviço de Clientes rodando na porta ${PORT}`);
});