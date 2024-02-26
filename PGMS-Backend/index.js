require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const tenantRoutes = require('./routes/tenantRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.send('PGMS'));
app.use('/admin', adminRoutes);
app.use('/tenant', tenantRoutes); 

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Server started on port no.  "+PORT);
    });
})
.catch((error)=>{
    console.log(error);
})
