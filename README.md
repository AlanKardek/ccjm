# Montello

Plataforma web moderna em Next.js dedicada a Josué Montello, com catálogo de obras, comunidade literária, autenticação, PWA e banco PostgreSQL via Prisma.

## Funcionalidades

- Next.js App Router, TypeScript e Tailwind CSS.
- PWA com `manifest.json`, service worker, ícones, modo standalone e cache offline básico.
- Auth.js com login por email/senha, Google, Facebook, sessão persistente e logout.
- Cadastro, recuperação de senha preparada por token, perfil privado e proteção de rota.
- Catálogo de obras com busca, filtro por gênero, SEO e metadata dinâmica.
- Página de obra com comentários, resenhas, curtidas, favoritos, avaliação e status de leitura.
- Perfil com favoritos, histórico, livros lidos, lendo, quero ler, comentários, resenhas e estatísticas.
- Prisma ORM com modelos `User`, `Book`, `Comment`, `Review`, `Favorite`, `UserBook`, `Like` e modelos Auth.js.
- Seed inicial com obras reais de Josué Montello e um usuário demo.

## Rodando localmente

1. Instale dependências:

```bash
npm install
```

2. Configure o ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Suba um PostgreSQL local e ajuste `DATABASE_URL` no `.env`.

Com Docker:

```bash
docker compose up -d
```

4. Gere o Prisma Client e rode a migration:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

5. Popule o banco:

```bash
npm run prisma:seed
```

Usuário demo:

```text
email: leitora@montello.app
senha: montello123
```

6. Inicie:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## OAuth

Preencha no `.env`:

```text
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_FACEBOOK_ID=
AUTH_FACEBOOK_SECRET=
AUTH_SECRET=
AUTH_URL=http://localhost:3000
```

Use URLs de callback:

```text
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/facebook
```

## Deploy na Vercel

1. Crie um banco PostgreSQL, por exemplo Vercel Postgres, Neon, Supabase ou Railway.
2. Configure as variáveis `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_FACEBOOK_ID` e `AUTH_FACEBOOK_SECRET`.
3. Rode a migration no ambiente de deploy ou local apontando para o banco remoto:

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

4. Faça o deploy:

```bash
vercel
```

O build já foi validado com `npm run lint` e `npm run build`.
