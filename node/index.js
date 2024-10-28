const express = require('express');
const {connectMongoDb} = require('./connection.js');
const reportRouter = require('./routes/report.js');

const app = express();
const port = 3000;

// Connect to MongoDB
connectMongoDb('mongodb://root:password@localhost:27017/habitatmap')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:\n' + 
    'Check if db container is running and mongodb service is up. ' +
    'If there is still an issue read this error msg:\n\n', err));

// Middleware
app.use(express.json());

// Define the route for the root path
// Restful API

//Report APIs using router:
app.use('/reports', reportRouter);





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});