const express = require('express');
const app = express();
const port = 3000;

// Define the route for the root path
// Restful API
app.get('/reports', (req, res) => {
  res.send('All reports will be returned in json format using res.json()');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});