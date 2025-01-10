# DD Foods

Marketplace de delivery desenvolvido com Next.js, com busca de restaurantes, catalogo de produtos, sacola e acompanhamento de pedidos. A interface adapta-se a celulares, tablets e desktops, mantendo o conteudo principal limitado a 1280 px.

## Preview

<!-- Adicione aqui capturas de tela mobile e desktop ou o link da demonstracao publicada. -->

## Funcionalidades

- Busca de restaurantes por nome e navegacao por categorias.
- Catalogo de produtos com ofertas, descontos e informacoes de entrega.
- Sacola restrita a um restaurante, com calculo de subtotal, descontos e entrega.
- Finalizacao de pedido com precos recalculados e validados no servidor.
- Login com Google e login simulado exclusivo para desenvolvimento local.
- Historico de pedidos, opcao de refazer pedidos e restaurantes favoritos.
- Layout responsivo com navegacao adaptada a telas pequenas e grandes.

## Stack Tecnologica

| Tecnologia                | Versao / Uso                                                  |
| ------------------------- | ------------------------------------------------------------- |
| Next.js                   | 16.4.1, App Router e Server Actions                           |
| React / React DOM         | 19.3.1                                                        |
| TypeScript                | 5.x                                                           |
| Tailwind CSS              | 3.4.19                                                        |
| Prisma / Prisma Client    | 5.22.0                                                        |
| PostgreSQL                | 16, via Docker Compose no ambiente local                      |
| NextAuth                  | 4.24.15, Google OAuth e autenticacao local de desenvolvimento |
| Radix UI, Lucide e Sonner | Componentes acessiveis, icones e notificacoes                 |

## Arquitetura e Decisoes Tecnicas

- O App Router organiza paginas dinamicas e componentes de servidor e cliente.
- Prisma acessa o PostgreSQL; migrations versionam o schema e o seed cria dados de demonstracao.
- As Server Actions derivam a identidade do usuario da sessao. A criacao de pedidos consulta novamente produtos, quantidades, descontos e entrega no banco antes de persistir valores.
- A sacola e mantida em contexto React e aceita produtos de um restaurante por vez.
- O container PostgreSQL e destinado ao desenvolvimento local. Para deploy serverless, use um banco gerenciado acessivel pela aplicacao hospedada.

## Executar Localmente

### Requisitos

- Node.js 20.9 ou superior e npm.
- Docker Desktop em execucao.

### Instalar e configurar

1. Instale as dependencias:

   ```bash
   npm install
   ```

2. Copie o arquivo de exemplo para `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Substitua `NEXTAUTH_SECRET` por um segredo aleatorio. Um valor pode ser gerado com:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   O valor local de `NEXT_PUBLIC_LOCAL_AUTH_ENABLED` deve permanecer `true` para habilitar o login simulado em desenvolvimento. Esse mecanismo e desativado automaticamente em producao. As credenciais Google podem ficar vazias no ambiente local.

### Banco de dados

1. Inicie o PostgreSQL local:

   ```bash
   docker compose up -d
   ```

2. Aplique as migrations e carregue os dados de demonstracao:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

O Compose disponibiliza o banco `dd_foods` em `localhost:5432`. As credenciais locais e a URL correspondente estao no `.env.example`.

### Iniciar a aplicacao

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O botao de login usa o usuario local de desenvolvimento quando `NEXT_PUBLIC_LOCAL_AUTH_ENABLED=true`.

### Validacoes

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deploy

O projeto esta preparado para build no Next.js e hospedagem serverless na Vercel. Configure no ambiente de producao `DATABASE_URL` para um PostgreSQL gerenciado, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`. O login local e ignorado em producao. Nenhum deploy ou banco remoto foi configurado.
