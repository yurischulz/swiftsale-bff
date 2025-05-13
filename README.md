# Backend BFF - Aplicativo de Gestão de Vendas

## Instalação

```bash
git clone <repo>
cd bff-backend
cp .env.example .env
yarn install
yarn dev
```

## Rotas principais

- Autenticação: `/auth/login`, `/auth/register`
- Clientes: `/clients`
- Produtos: `/products`
- Afiliações: `/affiliations`
- Vendas: `/sales`
- Pagamentos: `/payments`
- Dashboard: `/dashboard`

Todos requerem JWT salvo no `Authorization: Bearer <token>`.

## Mongo

### Autenticação

**User**:

- usuário: `devys-admin`
- senha: `pbUt8eeZmjYTnMLB`
