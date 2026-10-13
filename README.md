# Cadastro de Clientes — Node.js + Angular + Oracle SQL/PL-SQL

Projeto minimalista de portfólio criado para estudos de Node.js, Angular e Oracle: API REST em Node.js/Express, interface em Angular
consumindo API e scripts SQL/PL-SQL (Oracle) para a camada de banco.

## Estrutura

```
portfolio-clientes/
├── backend/                  # API Node.js + Express
│   └── src/
│       ├── server.js         # sobe o servidor (porta 3000)
│       ├── app.js            # middlewares (CORS, JSON) e montagem das rotas
│       ├── routes/           # define GET e POST /api/clientes
│       ├── controllers/      # validação de entrada e respostas HTTP
│       └── repositories/     # acesso a dados (em memória; trocável por Oracle)
├── frontend/                 # Angular 21 (standalone components + signals)
│   └── src/app/
│       ├── models/           # interface Cliente
│       ├── services/         # ClienteService (HttpClient)
│       └── clientes/         # componente: formulário + tabela
└── database/
    ├── 01_create_table.sql       # tabela, sequence, constraints, dados de exemplo
    └── 02_atualiza_status.sql    # procedure PL/SQL + bloco anônimo
```

## Pré-requisitos

- **Node.js 22 LTS ou 24 LTS** (mínimo 20.19) — já inclui o npm
- **Git**
- **VS Code** (opcional, mas recomendado)
- Para executar os scripts `.sql`: um Oracle (Oracle XE + SQL Developer) ou o
  [Oracle Live SQL](https://livesql.oracle.com) no navegador, sem instalar nada

Não precisa instalar o Angular CLI globalmente: o projeto usa `npx ng`.

## Como rodar

Abra **dois terminais** na raiz do projeto.

**Terminal 1 — API**

```bash
cd backend
npm install
npm start
```

API em `http://localhost:3000`.

**Terminal 2 — Frontend**

```bash
cd frontend
npm install
npx ng serve
```

Acesse `http://localhost:4200`.

## Endpoints

| Método | Rota             | Descrição                                   | Retorno |
|--------|------------------|---------------------------------------------|---------|
| GET    | `/api/clientes`      | Lista todos os clientes                         | 200     |
| POST   | `/api/clientes`      | Cria cliente (`{ "nome": "", "email": "" }`) | 201 / 400 |
| PUT    | `/api/clientes/:id`  | Atualiza nome e e-mail do cliente                | 200 / 400 / 404 |
| DELETE | `/api/clientes/:id`  | Exclui um cliente                                 | 204 / 400 / 404 |

Teste rápido sem o frontend:

```bash
curl http://localhost:3000/api/clientes

curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"Ana Lima","email":"ana@exemplo.com"}'

curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Lima","email":"maria.lima@exemplo.com"}'

curl -X DELETE http://localhost:3000/api/clientes/1
```

`PUT` substitui os campos editáveis (`nome` e `email`); `DELETE` responde `204`
sem corpo quando a exclusão funciona. Em ambos os casos, `404` significa que o
ID não existe. A API continua usando memória: reiniciar o Node restaura os dados iniciais.

## Banco de dados (Oracle)

Execute em ordem:

1. `database/01_create_table.sql` — cria `CLIENTES`, a sequence e insere 2 registros.
2. `database/02_atualiza_status.sql` — cria a procedure `atualiza_status_cliente`
   (valida o status, trata `NO_DATA_FOUND`, faz `COMMIT`/`ROLLBACK`) e executa um bloco anônimo de exemplo.

> Por simplicidade, a API usa um repositório **em memória**, para o projeto rodar sem
> banco instalado. O repositório isola o acesso a dados; para usar Oracle basta
> reimplementar as operações (`listar`, `criar`, `atualizar` e `excluir`) com
> `node-oracledb`, sem alterar rotas nem controllers.

As operações correspondentes em SQL usam parâmetros vinculados (bind variables):

```sql
UPDATE clientes
   SET nome = :nome, email = :email
 WHERE id = :id;

DELETE FROM clientes
 WHERE id = :id;
```

No Oracle, o repositório deve verificar quantas linhas foram afetadas para
responder `404` quando o ID não existe e confirmar a transação com `COMMIT`.

## Decisões de design

- **Camadas no backend** (rota → controller → repositório): cada camada tem uma
  responsabilidade, o que facilita testes e a troca da fonte de dados.
- **Validação na borda**: o controller rejeita payload inválido com `400` e mensagem clara.
- **Angular moderno**: componentes standalone, `inject()`, signals e o novo
  control flow (`@if`, `@for`) em vez de módulos e diretivas estruturais.
- **Serviço HTTP separado do componente**: o componente só cuida de estado e UI.
- **PL/SQL defensivo**: validação de parâmetro, exceção nomeada e transação explícita.

## Próximos passos possíveis

- Rota `PATCH /api/clientes/:id/status` chamando a procedure via `node-oracledb`
- Variáveis de ambiente (`.env`) para porta e conexão
- Testes automatizados (Jest/Supertest no backend, TestBed no frontend)
- Paginação e filtro por status na tabela
