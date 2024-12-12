// index.js (main Express app)

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectMongoDb } = require('./connection.js');
const { router: authRouter } = require('./routes/auth');
const reportRouter = require('./routes/report.js');

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectMongoDb(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'));
//.catch((err) => console.error('Could not connect to MongoDB:\n' +
//  'Check if db container is running and mongodb service is up. ' +
//  'If there is still an issue read this error msg:\n\n', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));



//Only for testing purposes
const { Report } = require('./models/report.js');
app.get('/species/search', async (req, res) => {
  const q = req.query.query;
  console.log(q);
  const species = await Report.find({ 'species.commonName': { $regex: q, $options: 'i' } }, { 'species': 1, '_id': 0 });
  const flattenedSpecies = species.map(sp => sp.species);
  console.log(flattenedSpecies);
  res.status(200).json(flattenedSpecies);
});

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


