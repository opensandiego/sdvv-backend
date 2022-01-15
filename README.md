<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation
- Install Docker https://docs.docker.com/get-docker/

- Fork this repo to your personal GitHub.

- Use git to clone your fork to your local development environment.

- Checkout the ```develop``` branch

- Install the dependencies  
```bash
$ npm install
```

Create a ``.env`` file in the root of your local repository then copy and paste in the following:
```
DATABASE_URL=postgres://postgres:example@localhost:54321/postgres
REDIS_URL=redis://localhost:6379
```

- Install the three Docker containers (Postgres, pgAdmin, Redis) using:
```
$ docker-compose up -d
```

- Create the database tables using:
``` 
npm run typeorm migration:run
```

## Load the data into the database

- Run the worker process. This starts up the queue to wait for tasks. The console for this process will update after each item in the queue is completed.
```
npm run start:worker:dev
```

- Run the console command to add the database initialization tasks to the queue. This command completes immediately. The console running the worker process will update as the queue is processed.
```
node -r ts-node/register apps/standalone-worker/src/console.ts initialize-data
```

The worker process will fetch and add the data to the database. This may take a few minutes. When you see 'Populating Database with Zip Codes by jurisdiction Complete' in the worker console then the update has been complete. The worker process can be stopped after the update is complete.


## Run the web part of the backend

```
npm run start:web:dev
```

To test the backend server browse to http://localhost:3000/


<!-- ## View the database in pgAdmin
The docker containers need to be running to access pgAdmin.
From a browser go to http://localhost:5050/
Login to pgAdmin with:
Username: admin@admin.com
Pasword: admin

Create a connection to the database in pgAdmin
... not yet available  -->

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
