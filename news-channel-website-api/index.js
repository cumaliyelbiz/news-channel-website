//nodejs basic api with express
const express = require('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
//add body parser
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
// Route'lar
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const panelRoutes = require('./routes/panelRoutes');
app.use('/api/panel', panelRoutes);
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);


app.listen(port, () => {
  console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`);
});

// Serve static files from the "public" directory
app.use(express.static('public'));