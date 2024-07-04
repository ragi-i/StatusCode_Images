const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();
app.use(cors());
dotenv.config();
const port = 8000;

connectDB();

app.use(express.json());

app.use('/', userRoutes);
app.use('/', listRoutes);



app.get('/', (req, res) => {
    res.send("hi");
});

app.listen(port, () => {
    console.log("Port is listening on", port);
});
