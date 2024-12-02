const express = require('express');
const cors = require('cors');
// const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const geminiRouter = require('./Routes/geminiRouter');

// Enable CORS
app.use(cors());
app.use(express.json());
app.use('/api', geminiRouter);

// Serve static files for the frontend
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, 'public', 'index.html'));
  res.send('Hello World');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
//home
// app.get('/', (req, res) => {
//   res.send('Hello World');
// } );