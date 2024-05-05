require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const configureAdminRoutes = require('./routes/adminRoutes');
const configureTenantRoutes = require('./routes/tenantRoutes');
const { ApolloServer } = require('apollo-server-express');
const { Server } = require('socket.io');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Routes
// app.get('/', (req, res) => res.send('PGMS'));
// app.use('/admin', adminRoutes);
// app.use('/tenant', tenantRoutes); 

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust based on your frontend deployment
  },
});


app.get('/', (req, res) => res.send('PGMS'));
app.use('/admin', configureAdminRoutes(io));
app.use('/tenant', configureTenantRoutes(io));

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.MONGODB_URI)
.then(async ()=>{
const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server
    await apolloServer.start();

    // Apply Apollo Server to Express
    apolloServer.applyMiddleware({ app });

    server.listen(PORT, ()=>{
        console.log("Server started on port no.  "+PORT);
    });
})
.catch((error)=>{
    console.log(error);
})
