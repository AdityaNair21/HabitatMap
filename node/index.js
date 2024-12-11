// index.js (main Express app)
const express = require('express');
const cors = require('cors');
const { connectMongoDb } = require('./connection.js');
const { router: authRouter } = require('./routes/auth');
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
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRouter);  // Authentication routes
app.use('/reports', reportRouter);  // Report routes

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const errRes = {
    status: err.status || 500,
    message: err.message || 'Something went wrong!'
  };
  return res.status(errRes.status).json(errRes);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});