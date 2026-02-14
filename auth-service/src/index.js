const express = require('express');
const cors = require('cors');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const authRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

try {
    const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
    
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/auth/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`Swagger carregado com sucesso de: ${swaggerPath}`);

} catch (error) {
    console.error("ERRO CRÍTICO AO CARREGAR SWAGGER:", error.message);
}

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "API de Autenticação (JWT) Online 🔐" });
});

app.listen(PORT, () => {
    console.log(`Serviço de Auth rodando na porta ${PORT}`);
});