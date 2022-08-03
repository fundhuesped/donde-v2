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

## Production

### Dokku setup

1. Install Dokku, set up SSH keys and virtualhost settings. [Read the docs](https://dokku.com/docs/getting-started/installation/).
2. Create the app.
   ```sh
   dokku apps:create
   ```
3. Create backing services.
   ```sh
   # Install the postgres plugin
   sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
   # Create the database service
   dokku postgres:create donde-db
   # Link the database service to the app. This will set the DATABASE_URL env config in the app.
   dokku postgres:link donde-db donde
   ```
4. Configure NextAuth. [Read more](https://next-auth.js.org/configuration/options).
   ```sh
   dokku config:set donde NEXTAUTH_URL='https://your.domain.com'
   dokku config:set donde NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   ```
5. Set up SSL through Let's Encrypt.
   ```sh
   # Install the letsencrypt plugin
   sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
   # Configure the plugin
   dokku config:set --global DOKKU_LETSENCRYPT_EMAIL=your-email@your.domain.com
   # Set the domain for the app
   dokku domains:set donde your.domain.com
   # Enable letsencrypt for the app
   dokku letsencrypt:enable donde
   # Set up SSL auto-renewal
   dokku letsencrypt:cron-job --add
   ```
