const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

const app = express();
app.use(cors());

connectDB();

app.use(express.json());

app.use('/api/products', productRoutes);

const PORT =  8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
