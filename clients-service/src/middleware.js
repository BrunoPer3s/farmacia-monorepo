const jwt = require('jsonwebtoken');

const lerToken = (req) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return null;
    return authHeader.split(' ')[1];
};

module.exports = {
    autenticado: (req, res, next) => {
        const token = lerToken(req);
        if (!token) return res.status(401).json({ error: 'Acesso negado. Faça login.' });

        try {
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ error: 'Token inválido.' });
        }
    },

    apenasAdmin: (req, res, next) => {
        const token = lerToken(req);
        if (!token) return res.status(401).json({ error: 'Acesso negado.' });

        try {
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);
            
            if (decoded.role !== 'admin') {
                return res.status(403).json({ error: 'Área restrita a administradores.' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            console.log(error);
            return res.status(403).json({ error: 'Token inválido.' });
        }
    }
};