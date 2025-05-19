# 🧠 SwiftSale BFF

Backend-for-Frontend (BFF) para o aplicativo **SwiftSale**, uma solução de vendas para profissionais autônomos. Este BFF serve como camada intermediária entre o frontend mobile (React Native + Expo) e os serviços de dados (MongoDB), encapsulando lógica de autenticação, regras de negócio e acesso aos dados.

## 📦 Tecnologias Utilizadas

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** (Autenticação)
- **Helmet**, **CORS**, **Morgan** (Segurança e logging)
- **Jest** (Testes)
- **ESLint** + **Prettier**

## 📁 Estrutura de Pastas

```bash
src/
├── config/ # Configurações (DB, interceptors)
├── controllers/ # Controladores HTTP
├── middlewares/ # Middlewares globais
├── models/ # Modelos Mongoose
├── routes/ # Rotas organizadas por domínio
├── services/ # Camada de serviços com regras de negócio
├── utils/ # Funções utilitárias (ex: asyncHandler)
├── tests/ # Testes unitários
└── app.ts # Inicialização da aplicação Express
```

## 🚀 Como rodar o projeto

```bash
# Instale as dependências
pnpm install
# Crie um arquivo .env com as variáveis de ambiente:
cp .env.example .env
```

### Exemplo de .env

```bash
PORT=4000
MONGO_URI=mongodb://localhost:27017/swiftsale
JWT_SECRET=sua_chave_secreta
```

### Rode o servidor em modo desenvolvimento

```bash
pnpm dev
```

## ✅ Endpoints

Todos os endpoints estão documentados via arquivos Markdown em /docs e disponíveis também em coleção Postman em /docs/postman.

### Principais Domínios

- /auth – Login e autenticação
- /clients – Gerenciamento de clientes
- /products – Produtos e estoque
- /sales – Vendas e pedidos
- /payments – Pagamentos de clientes
- /affiliations – Grupos de clientes
- /dashboard – Resumo de dados

## 🧪 Testes

```bash
pnpm test
```

## 📄 Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
