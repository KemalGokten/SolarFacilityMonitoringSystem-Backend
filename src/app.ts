import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';

import { connectDB } from './db/connects';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { mergedGQLSchema } from './schema';
import { resolvers } from './resolvers';

import jwt from 'jsonwebtoken';

import controllers from './controllers';

const MONGO_URI = process.env.MONGODB_URI as string;
const ORIGIN = process.env.ORIGIN as string;
const PORT = parseInt(process.env.PORT as string, 10);

// Initialize Express app
const app = express();

// Setup CORS
app.use(cors({origin: [ORIGIN],}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck route
app.get('/ping', (req, res) => res.status(200).json({ status: 'success' }));

// Register other routes
app.use(controllers);


// JWT validation middleware
const jwtValidationMiddleware = (token: string) => {
  if (token) {
    return jwt.verify(token.split(' ')[1], process.env.SECRET_KEY as string);
  }
  return null;
};

// Apollo Server setup
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs: mergedGQLSchema,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    // Start Apollo Server
    await server.start();

    // Integrate Apollo Server with Express
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }) => ({
          user: req.headers.authorization ? jwtValidationMiddleware(req.headers.authorization) : null,
        }),
      })
    );

    // Start Express server
    httpServer.listen(PORT, () => {
      console.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
      console.info(`Express server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error starting server:', error);
  }
};

start();

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose default connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose default connection disconnected');
});

process.on('SIGINT', () => {
  console.info('Mongoose default connection disconnected');
  mongoose.connection.close();
  process.exit(1);
});
