# 🎬 Minha Lista de Filmes

**Aluno:** Luiz Fernando Santo Silva Barroso
**Projeto escolhido:** Projeto B — Minha Lista de Filmes
**Link publicado (Vercel):** 

Aplicação fullstack para organizar filmes e séries que quero ver e os que já vi, com nota de 1 a 5 estrelas.

**Tecnologias:** Next.js, TypeScript, Drizzle ORM e Neon (PostgreSQL).

## Como rodar

1. Clone o repositório e entre na pasta:
   ```bash
   git clone LINK_DO_REPOSITORIO
   cd NOME_DA_PASTA
   ```
2. Crie um arquivo `.env` copiando o `.env.example` e coloque a URL do seu banco no Neon:
   ```
   DATABASE_URL="sua-url-do-neon"
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie a tabela no banco:
   ```bash
   npx drizzle-kit push
   ```
5. Rode o projeto:
   ```bash
   npm run dev
   ```
6. Abra [http://localhost:3000](http://localhost:3000).

## Tabela `filmes`

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | serial | chave primária |
| `titulo` | varchar(120) | obrigatório |
| `genero` | varchar(40) | obrigatório (Ação, Comédia, Drama, Terror, Animação, Outro) |
| `status` | varchar(15) | `quero_ver` ou `assistido` |
| `nota` | integer | de 1 a 5; só pode ter nota se `status = assistido` |
| `criadoEm` | timestamp | automático |

## Rotas da API

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/api/filmes?status=assistido&genero=Drama` | Lista filmes com filtros opcionais e devolve o resumo `{ total, assistidos, queroVer, mediaNotas }` |
| POST | `/api/filmes` | Cadastra um filme (`titulo`, `genero`) |
| PATCH | `/api/filmes/[id]` | Muda o status e/ou a nota |
| DELETE | `/api/filmes/[id]` | Apaga um filme |

## Telas

- `/`: página inicial com o resumo da lista
- `/filmes`: cartões de resumo, filtros por status e gênero, botão "Marquei como assistido" com nota em estrelas e grade de cartões responsiva