Guia de desenvolvimento local - banco e autenticação

1) Rodar Postgres com Docker (rápido):

```bash
# cria e roda um container Postgres local na porta 5432
docker run --name ccjm-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=ccjm -p 5432:5432 -d postgres:15
```

2) Criar arquivo `.env` local a partir do `.env.example` e atualizar valores:

```bash
# a partir do arquivo de exemplo
cp .env.example .env
# edite .env para ter:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ccjm?schema=public
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=<uma-chave-forte>
```

3) Gerar client Prisma, aplicar migrations e rodar seed:

```bash
# gerar client e aplicar migrations locais (interativo)
npx prisma migrate dev --name init
# gerar client explicitamente
npx prisma generate
# rodar seed se necessário
npm run prisma:seed
```

4) Rodar a aplicação em modo dev e testar login demo:

```bash
npm run dev
# abra http://localhost:3000/login
# use email: leitora@montello.app e senha: montello123
```

5) Configurar variáveis no Netlify (produção):

- `DATABASE_URL` apontando para seu banco de produção
- `NEXTAUTH_URL` com a URL do site (ex.: https://seusite.netlify.app)
- `NEXTAUTH_SECRET` e credenciais OAuth

Observações:
- Não comite o arquivo `.env` no repositório. Use o `.env.example` como referência.
- Se não quiser instalar Docker, pode usar um serviço de banco hospedado (ElephantSQL, Supabase, etc.) e apontar `DATABASE_URL` para ele.
