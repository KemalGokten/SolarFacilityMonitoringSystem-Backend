"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connects_1 = require("./db/connects");
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const controllers_1 = __importDefault(require("./controllers"));
const MONGO_URI = process.env.MONGODB_URI;
const PORT = parseInt(process.env.PORT, 10);
// Initialize Express app
const app = (0, express_1.default)();
// Setup CORS
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Healthcheck route
app.get('/ping', (req, res) => res.status(200).json({ status: 'success' }));
// Register other routes
app.use(controllers_1.default);
// JWT validation middleware
const jwtValidationMiddleware = (token) => {
    if (token) {
        return jsonwebtoken_1.default.verify(token.split(' ')[1], process.env.SECRET_KEY);
    }
    return null;
};
// Apollo Server setup
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs: schema_1.mergedGQLSchema,
    resolvers: resolvers_1.resolvers,
    introspection: true,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield (0, connects_1.connectDB)(MONGO_URI);
        console.log(`Connected to MongoDB at ${MONGO_URI}`);
        // Start Apollo Server
        yield server.start();
        // Integrate Apollo Server with Express
        app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
                return ({
                    user: req.headers.authorization ? jwtValidationMiddleware(req.headers.authorization) : null,
                });
            }),
        }));
        // Start Express server
        httpServer.listen(PORT, () => {
            console.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
            console.info(`Express server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
});
start();
mongoose_1.default.connection.on('error', (err) => {
    console.error(`Mongoose default connection error: ${err}`);
});
mongoose_1.default.connection.on('disconnected', () => {
    console.warn('Mongoose default connection disconnected');
});
process.on('SIGINT', () => {
    console.info('Mongoose default connection disconnected');
    mongoose_1.default.connection.close();
    process.exit(1);
});
