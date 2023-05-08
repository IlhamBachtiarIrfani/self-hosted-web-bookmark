# Setup & Installation

#### Build the Docker Container
To start using the application, the first step is to build the Docker container. To do this, navigate to the project root directory in your terminal and run the following command:

```bash
docker-compose up -d --build --force-recreate
```

This command will create a Docker container for the application, which can then be run locally. The -d flag runs the container in detached mode, which means that it runs in the background. The --build flag builds the container if it does not already exist, and the --force-recreate flag recreates the container if it already exists.


#### Migrate the Database
```bash
docker compose exec backend.local npx sequelize-cli db:migrate
```
