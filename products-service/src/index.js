const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const productRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

try {
    const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/products/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
    console.error("Erro ao carregar Swagger:", error.message);
}

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Produtos Online 💊" });
});

app.listen(PORT, () => {
    console.log(`Serviço de Produtos rodando na porta ${PORT}`);
});