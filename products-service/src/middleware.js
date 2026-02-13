const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Separa o "Bearer" do token

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado! Token não fornecido.' });
    }

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        if (req.method !== 'GET' && decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso proibido! Apenas admins podem alterar dados.' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
}

module.exports = verificarToken;