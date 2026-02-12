
# 💊 Farmácia Microservices API

Este projeto é uma implementação de uma API baseada em arquitetura de microsserviços para o gerenciamento de uma farmácia. O projeto utiliza **Node.js**, **Docker** e **MySQL**, desenvolvido como parte da disciplina de Tópicos Especiais em Redes.

## 🚀 Tecnologias Utilizadas

* **Node.js** (Runtime JavaScript)
* **Express** (Framework Web)
* **MySQL 8.0** (Banco de Dados Relacional)
* **Docker & Docker Compose** (Orquestração de Containers)
* **Arquitetura:** Monorepo com microsserviços independentes.

---

## 📋 Pré-requisitos

Para rodar este projeto, você precisa apenas ter instalado em sua máquina:

1.  **Git** (para clonar o repositório)
2.  **Docker** e **Docker Compose**
    * *Windows/Mac:* Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/).
    * *Linux:* Instale o Docker Engine e o plugin Docker Compose.

> **Nota:** Não é necessário instalar o Node.js ou MySQL localmente para rodar a aplicação, pois tudo será executado dentro de containers.

---

## 🔧 Como Rodar o Projeto

### 1. Clone o repositório
Abra seu terminal e execute:

```bash
git clone [https://github.com/SEU_USUARIO/farmacia-monorepo.git](https://github.com/SEU_USUARIO/farmacia-monorepo.git)
cd farmacia-monorepo
```

### 2. Suba os containers

Na raiz do projeto, execute o comando para construir as imagens e iniciar os serviços:
Bash

```bash
docker compose up --build
```

Aguarde até ver a mensagem **Serviço de Produtos rodando na porta 3001 e MySQL ... ready for connections.**

### 3. Configuração do Banco de Dados (Primeira Execução)

Como o banco de dados é criado do zero, as tabelas ainda não existem. Você precisa criá-las manualmente na primeira vez.

Em um novo terminal, acesse o container do banco:
    
```bash
docker exec -it farmacia-db mysql -u root -p
```

Digite a senha definida no docker-compose.yml: **rootpassword**


No prompt do MySQL **(mysql>)**, copie e cole os comandos abaixo para criar as tabelas:

```sql

USE farmacia_db;

-- Tabela de Produtos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    laboratory VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados de teste
INSERT INTO products (name, laboratory, price, stock_quantity, description) 
VALUES ('Dipirona 500mg', 'Medley', 5.99, 100, 'Analgésico e antitérmico');
```


Digite exit para sair do banco.

⚡ Testando a API

Com os containers rodando, você pode testar os endpoints disponíveis via **(curl)** ou postman/Insomnia.

Serviço de Produtos (Porta 3001)

Listar todos os produtos:
```bash

curl http://localhost:3001/products
```

Criar um novo produto:
```bash

    curl -X POST http://localhost:3001/products \
         -H "Content-Type: application/json" \
         -d '{"name": "Omeprazol", "laboratory": "EMS", "price": 12.50, "stock_quantity": 50, "description": "Para estômago"}'
```

📂 Estrutura do Projeto

    Abaixo está a organização dos microsserviços dentro do repositório:

    📂 /auth-service: Microsserviço responsável pela autenticação e gestão de usuários (Porta 3000).

    📂 /products-service: Microsserviço responsável pelo catálogo de medicamentos (Porta 3001).

    📂 /clients-service: Microsserviço responsável pelos dados dos clientes (Porta 3002).

    🐳 docker-compose.yml: Arquivo de orquestração que sobe todo o ambiente localmente.


