const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'farmacia_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(conn => {
        console.log("Conectado ao MySQL com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.error("Erro ao conectar no MySQL:", err);
    });

module.exports = pool;