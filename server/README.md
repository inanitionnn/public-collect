# Nest.js + Bun.js + Drizzle

## Installation

```bash
$ bun install
```

## Running the app

```bash
# development
$ bun dev
```

```bash
# production
$ bun prod
```

## Test

```bash
# unit tests
$ bun test
```

```bash
# test coverage
$ bun test:cov
```

## Drizzle

Drizzle kit **don't** have PgVector support, so you **can't** use push command

```bash
#drizzle kit push command
$ bun run drizzle-kit push:pg
```

You **can** push generated SQL by yourself.

1. install PgVector on your PC
2. create database
3. run this SQL in the database

```bash
$ CREATE EXTENSION IF NOT EXISTS vector
```

4. generate drizzle SQL

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

## Sharp

For Sharp to work, you need to install the version that is suitable for your device. In my case, this is --platform=linux --arch=x64

```bash
# don't know how to do this in bun
# but it's okay if you mix npm and bun
# if you know how to fix this, please text me
$ npm install --platform=linux --arch=x64 sharp
```
