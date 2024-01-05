# E-Natal
Aplicação de back-end para o desafio técnico da vaga de desenvolvedor back-end júnior. Nesta aplicação é possível gerenciar o back-end do sistema E-Natal, que ajuda o Sr. Santa Claus na produção e entrega de presentes, enviando e-books como presentes natalinos via e-mail através de requisições HTTP(s) seguindo a convenção REST.

# Demo
[Deploy do Projeto]()

# Como funciona?
Este projeto é uma REST API para atender a aplicação de envio de e-books como presentes natalinos via e-mail para o sistema E-Natal. Ela possui duas entidates: `users` e `ebooks`. As características destas entidades estão nos arquivos da pasta `dto` de cada módulo.

Para cada entidade foi realizado um CRUD:

### CRUD de Ebooks [Create | Read | Update | Delete]
- POST `\ebooks`: Cria um novo e-book. Recebe *title*, *author*, *description* e *pdf* pelo body. A combinação de título e autor não podem ser iguais, caso isso aconteça, um erro 409 é retornado. A estrutura esperada para um e-book é:
```
{
 "title": string
 "author": string
 "description": string (opcional)
 "pdf": string
}
```
- GET `\ebooks`: Retorna todos os ebooks encontrados.
- GET `\ebooks\:id`: Busca um ebook específico dado um id. Se não for encontrato, retorna um erro 404.
- PUT `\ebooks\:id`: Atualiza os dados de um e-book dado o seu id e os campos enviados. A combinação de título e autor não pode ser de um e-book já existente, caso isso aconteça, um erro 409 é retornado. O conflito só ocorrerá caso essa combinação pertença a outro e-book. O administrador pode atualizar qualquer propriedade, a estrutura esperada para um e-book é a mesma do POST.
- DELETE `\ebooks\:id`: Deleta um e-book dado o seu id. Se o e-book não existir, o erro 404 é retornado.

### CRUD de Usuários [Create | Read | Update | Delete]
- POST `\users`: Cria um novo usuário. Recebe *name*, *email* e *ebooks* pelo body. Os usuários não podem ter emails iguais, caso isso aconteça, um erro 409 é retornado. A estrutura esperada para um usuário é:
```
{
 "name": string
 "email": string
 "ebooks": number[]
}
```
- GET `\users`: Retorna todos os usuários encontrados.
- GET `\users\:id`: Busca um usuário específico dado um id. Se não for encontrato, retorna um erro 404.
- PUT `\users\:id`: Atualiza os dados de um usuário dado o seu id e os campos enviados. Se o id não corresponder a nenhum usuário, o erro 404 é retornado. A estrutura esperada para um usuário é a mesma do POST. Ao editar os e-books da sua lista de desejos, a lista anterior é substituída pela atual.
- DELETE `\users\:id`: Deleta um usuário dado o seu id. Se o usuário não existir, o erro 404 é retornado.

As rotas POST, PUT e DELETE de e-book, e DELETE de usuários são autenticadas, portanto apenas o administrador pode usá-las. A autenticação do administrador é feita através da rota:

- POST `\sign-in`: Loga o administrador. Recebe *username* e *password* que são passados pelo `.env` através das variáveis `ADMIN_USER` e `PASSWORD`. Gera um token que permite acesso às rotas autenticadas.

O módulo de `scheduler` é responsável pelo envio dos emails a partir das 00:00h do dia 25 de Dezembro de cada ano.

# Motivação
Este projeto foi desenvolvido para praticar a construção de uma REST API usando o ecossistema Node e Nest junto com as tecnologias TypeScript e Prisma.

# Tecnologias Utilizadas
- Node (versão 16.17.0);
- Nest;
- TypeScript;
- Prisma;
- Postgres;
- JWT;
- Nodemailer;
- Schedule.

# Como rodar em desenvolvimento
Para executar este projeto em desenvolvimento é necessário seguir os passos abaixo:

- Clonar o repositório;
- Baixar as dependências necessárias com o comando: `npm install`;
- Em seguida, criar o arquivo `.env` com base no `.env.example`;
- Este arquivo `.env` é composto pelas seguintes propriedades:
```
  DATABASE_URL="postgresql://postgres..."
  JWT_SECRET="jwt_secret"
  
  ADMIN_USER="username"
  PASSWORD="password"
  
  EMAIL_USER="user@mail.com"
  EMAIL_PASSWORD="password"
  EMAIL_HOST="smtp.host.com"
  EMAIL_PORT="587"
```
- As propriedades possuem seus usos individuais:
  - `DATABASE_URL` é usada para fazer a conexão com o banco de dados;
  - `JWT_SECRET` é a senha utilizada para criptografar dados sensíveis;
  - `ADMIN_USER` e `PASSWORD` são os dados do administrados para ter acesso às rotas autenticadas;
  - `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_HOST` e `EMAIL_PORT` são usados para realizar o disparo de emails.

- Será necessário executar o Prisma para criar o banco de dados e as tabelas necessárias. Para isso, execute o comando: `npx prisma migrate dev`;
- Para rodar o projeto em desenvolvimento, execute o comando `npm run start:dev`.

# Como rodar em produção
- Buildar o projeto com `docker build --network host -t your-nestjs-app .`;
- Subir a plataforma com `docker run --network host -d your-nestjs-app`.
