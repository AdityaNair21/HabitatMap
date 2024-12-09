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


// Restful API
//Report APIs using router:
app.use('/reports', reportRouter);

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const errRes = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  };
  return res.status(errRes.status).send(errRes);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});