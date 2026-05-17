# Bassgunça 🎛️

Plataforma dedicada à cena underground, conectando DJs, produtores, artistas e o público.

Este repositório contém tanto a API (Back-end) quanto a Interface (Front-end) do projeto. Siga os passos abaixo para rodar a aplicação localmente.

## 🛠️ Tecnologias Utilizadas

- **Front-end:** React (Vite/CRA)
- **Back-end:** Node.js + Express
- **Banco de Dados:** MySQL

## ⚙️ Como rodar o projeto

Você precisará de dois terminais abertos para rodar o Back-end e o Front-end simultaneamente.

### 1. Rodando o Back-end (API)

Abra o primeiro terminal na pasta raiz do projeto (`BASSGUNCA`) e instale as dependências (caso seja a primeira vez):

npm install

Inicie o servidor local:

npx nodemon src/server.js

_(O servidor deverá rodar na porta 3000)._

### 2. Rodando o Front-end (React)

Abra um segundo terminal, entre na pasta do front-end e instale as dependências:

cd bassgunca-front
npm install

Inicie a interface:

npm run dev

_(Acesse no seu navegador através do localhost indicado no terminal)._

## 🗄️ Banco de Dados

Certifique-se de que o seu serviço MySQL (XAMPP, WAMP, Docker, etc.) está rodando antes de iniciar a API. O arquivo `.env` na raiz do projeto deve conter as credenciais de acesso ao seu banco local.
