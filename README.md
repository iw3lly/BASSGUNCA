# Bassgunça 🎛️🔥

Plataforma voltada para a cena underground brasileira, conectando DJs, produtores, coletivos, artistas e o público em um único ambiente digital.

O sistema permite divulgação de eventos, criação de perfis artísticos, feed social da cena, gerenciamento de line-ups e interação entre usuários.

---

# ✨ Funcionalidades

## 👤 Usuários

- Login e autenticação
- Perfil personalizado
- Edição de informações e redes sociais
- Visualização de perfis públicos

## 🎫 Eventos

- Criação de eventos
- Edição e exclusão
- Sistema de interesse/presença
- Eventos únicos e festivais multi-day
- Eventos encerrados automaticamente

## 📰 Feed Social

- Publicação de posts
- Edição de publicações
- Exclusão de posts
- Integração com perfis

## 🎧 Artistas

- Página de artistas da cena
- Busca por participantes de eventos
- Integração com line-ups

---

# 🛠️ Tecnologias Utilizadas

## Front-end

- React
- Vite
- CSS3
- Framer Motion
- React Hot Toast
- React Icons

## Back-end

- Node.js
- Express

## Banco de Dados

- MySQL

---

# 📁 Estrutura do Projeto

```bash
BASSGUNCA/
├── bassgunca-front/   # Front-end React
├── src/               # API Node/Express
├── database/          # Scripts SQL
├── uploads/           # Arquivos enviados
└── README.md
```

---

# ⚙️ Como rodar o projeto

Você precisará de dois terminais abertos.

---

# 🚀 1. Rodando o Back-end

Na raiz do projeto:

```bash
npm install
```

Inicie o servidor:

```bash
npx nodemon src/server.js
```

Servidor padrão:

```bash
http://localhost:3000
```

---

# 💻 2. Rodando o Front-end

Abra outro terminal:

```bash
cd bassgunca-front
npm install
npm run dev
```

Acesse:

```bash
http://localhost:5173
```

---

# 🗄️ Banco de Dados

Certifique-se de que o MySQL esteja ativo.

Exemplos:

- XAMPP
- WAMP
- Docker
- Laragon

O arquivo `.env` deve conter:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bassgunca
DB_PORT=3306
```

---

# 📸 Preview

## Home

Interface principal da plataforma com feed e eventos.

## Perfil

Perfis personalizados para artistas e produtores.

## Eventos

Sistema de divulgação underground com line-up e presença.

---

# 🎯 Objetivo do Projeto

O Bassgunça foi desenvolvido com foco em fortalecer a cena underground local, oferecendo uma plataforma independente para divulgação de artistas, eventos e coletivos.

---

# 👨‍💻 Desenvolvido por

Wellyngton Santos

GitHub:
https://github.com/iw3lly
