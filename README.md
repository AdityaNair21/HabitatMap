## Getting Started

### Starting and Running Services/Containers

#### Prerequisite: .env file in the root folder

To start and run the services/containers listed in the Docker Compose file in detached mode, use the following command:

```sh
docker compose up -d
```

For a GUI, you can use Docker Desktop. After running the above command, there will be four containers running under **HABITATMAP**: front-end, back-end, db-admin, and db.

To terminate the containers, use the following command:

```sh
docker compose down
```

Alternatively, you can use Docker Desktop.

### Accessing the Website

After **HABITATMAP** is running, go to your browser and navigate to [http://localhost:3001](http://localhost:3001). Sign up to create a new user, then log in. You will be redirected to the dashboard, which currently contains static data except for the user's info.

### Accessing the Database (MongoDB)

To access the MongoDB database from the terminal with admin privileges, use the following command:

```sh
docker exec -it db mongosh -u root -p password
```

You will see `test>`. The following command will take you to the `habitatmap` database:

```sh
use habitatmap
```

Now you can access all collections: users, species, reports and any others that might be added in the future.
### Accessing the Database via Mongo Express

Alternatively, you can access the MongoDB database using Mongo Express, which is available in the `db-admin` container. Open your browser and navigate to [http://localhost:8081](http://localhost:8081).

### Populating Data

If you use Mongo Express to upload a JSON file to populate data, keep in mind that Mongo Express requires an `_id` to be present for each document. Alternatively, you can use the `db` container and populate data using the `mongoimport` command, which does not require an `_id`.
