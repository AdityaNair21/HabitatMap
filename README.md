## Getting Started

### Starting and Running Services/Containers

To start and run the services/containers listed in the Docker Compose file in detached mode, use the following command:

1. `docker compose up -d`

For a GUI, you can use Docker Desktop. After running the above command, there will be three containers running under **HABITATMAP**: front-end, back-end, and db.

To terminate the containers, use the following command:

2. `docker compose down`

Alternatively, you can use Docker Desktop.

### Accessing the Database (MongoDB)

To access the MongoDB database from the terminal with admin privileges, use the following command:

3. `docker exec -it db mongosh -u root -p password`

You will see `test>`. The following command will take you to the `habitatmap` database:

4. `use habitatmap`

Now you can access all collections; users, species, reports, and any other which might be add in future.
