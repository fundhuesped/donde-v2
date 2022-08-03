# Dónde

## Development

### Requirements

- [NVM](https://github.com/nvm-sh/nvm) to set up the node version used by the app.
- [Yarn](https://yarnpkg.com/) to manage node dependencies.
- [Docker Compose](https://docs.docker.com/compose/) to run backing services.

### Setup

1. Install node dependencies.
   1. Run `nvm use` to configure the node version used by the app.
   2. Run `yarn install` to install all node dependencies.
2. Set up the database and run schema migrations.
   1. Run `docker-compose up -d` to bring up the database.
   2. Run `npx prisma db push` to run all schema migrations.

### Run the app

1. Run `nvm use` to configure the node version used by the app.
2. Run `docker-compose up -d` to bring up the backing services.
3. Run `yarn dev` to start the app at http://localhost:3000.
