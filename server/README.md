## Installation

```bash
$ bun install
```

## Running the app

```bash
# development
$ bun dev

# production
$ bun prod
```

## Test

```bash
# unit tests
$ bun test

# e2e tests
$ bun test:e2e

# test coverage
$ bun test:cov
```

## About drizzle

Drizzle kit don't have PgVector support, so i don't use push command

```bash
$ bun run drizzle-kit push:pg
```

You can push generated SQL by yourself.

1. install in you pc PgVector
2. create database
3. run SQL query in the database

```bash
$ CREATE EXTENSION IF NOT EXISTS vector
```

4. generate SQL

```bash
$ bun db:generate
```

5. in generated SQL change all

```
"embedding" "vector(1536)"
```

to

```
"embedding" vector(1536)
```

6. run the SQL
