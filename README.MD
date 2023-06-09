# Moi Meow - Self Hosted Web Bookmark
![Screenshot](docs/web-bookmark-preview.png)
The released program is a feature-rich website bookmarking tool designed to enhance your web browsing experience. It offers the following key features:

### Website Tagging
Organize your bookmarks with ease by adding custom tags. Tagging allows for convenient categorization, making it simple to find and manage your saved websites.

### Website Metadata
Retrieve and store essential metadata for each bookmarked website. This includes details such as the title, description, and favicon, providing you with additional information about your saved websites.

### Website Screenshot Preview
Get a visual reference for your bookmarks with real-time screenshot previews. The program generates and displays screenshots of the bookmarked websites, giving you a quick overview of each site.

### Real-time Search
Effortlessly find your bookmarks using the program's powerful real-time search functionality. Search through website titles, tags, and metadata to instantly locate the bookmarks you need.

# Setup & Installation

## Run with Docker
### Build the Docker Container
To start using the application, the first step is to build the Docker container. Follow the steps below:

1. Open your terminal and navigate to the project's root directory.
2. Execute the following command to build the Docker container:

```bash
docker compose up -d --build --force-recreate
```

This command will create a Docker container for the application and run it locally. The -d flag runs the container in detached mode, meaning it runs in the background. The --build flag builds the container if it doesn't exist, and the --force-recreate flag recreates the container if it already exists.

### Migrate the Database

> **Warning!**
> Ensure that your Docker build process has completed before proceeding.

To migrate the database, run the command.
```bash
docker compose exec backend.local npx sequelize-cli db:migrate
```

### Open The Application
Once the servers are running, open [http://localhost:13001](http://localhost:13001) in your web browser to access the application.

---

## Run in localhost
### Configure Front End Environment
Set the following environment variable in the frontend directory's `./frontend/.env` file.

```bash
API_PORT=13002
```

### Configure Back End Environment
Configure the following database environment variables in the backend directory's `./backend/.env` file to match your database settings.
```bash
DB_USER=root
DB_PASS=
DB_NAME=webBookmarkDB
DB_HOST=localhost
DB_PORT=3306
```

### Migrate the Database
> **Warning!**
> Ensure that your already have `webBookmarkDB` database

To migrate the database, open the `backend` directory and run the command.
```bash
npx sequelize-cli db:migrate
```

### Run Program
To run the program locally, follow these steps:
1. Open the `frontend` directory.
2. Execute the command.
    ```bash
    npm run start
    ```

3. Open the `backend` directory.
4. Execute the command.
    ```bash
    npm run start
    ```

These steps will start the frontend and backend servers, respectively, allowing you to use the program on your local machine.

### Open The Application
Once the servers are running, open [http://localhost:3000](http://localhost:3000) in your web browser to access the application.