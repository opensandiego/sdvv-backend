<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```
To install the Postgres database using Docker run 
$ docker-compose up -d

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploying to Heroku for development testing
This repo can be deployed to Heroku using a free account but billing will need to be added to the account unless Redis is disabled before deploying.

1. Open the Heroku website and create a new app.
2. Add the following Heroku addons to the app:
* Heroku Postgres 
* Heroku Redis (requires billing)
3. On your local development computer Install Git, the Heroku CLI, and create a Heroku remote. (see: https://devcenter.heroku.com/articles/git)
4. Deploy the app to Heroku from the nestjs branch using: `git push heroku nestjs:main `
5. Open the Heroku website in a browser and then choose the app from https://dashboard.heroku.com/apps.
6. Verify that the app is deployed by viewing the logs from the More menu. Also click the Open app button.
7. Use Run console from the More menu.
8. First run: `npm run typeorm schema:log`.  This should show something like `Schema syncronization will execute following sql queries:`
9. To create  the tables in the database run the migrations using the Run console with: 
``` 
npm run typeorm migration:run
```
If there is a need to reverse the migrations use:
```
npm run typeorm migration:revert
```
It is recommended to connect to the Heroku database using pgAdmin to monitor contents of the database.
