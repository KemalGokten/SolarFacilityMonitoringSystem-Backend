"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersGQLSchema = void 0;
const graphql_1 = require("graphql");
exports.usersGQLSchema = (0, graphql_1.buildSchema)(`
    type User {
        id: String!
        username: String!
        email: String!
    }

    type AuthPayload {
        user: User!
        token: String!
    }

    type Query {
        user(id: String!): User!
        verifyToken: User!
    }

    type usersInfoResponse {
        success: Boolean!
        total: Int!
        users: [User!]!
    }

    type Mutation {
        regUser(username: String!, email: String!, password: String!): User!
        loginUser(email: String!, password: String!): AuthPayload!
        updateUser(id: String!, username: String, email: String, password: String): User!
        forgotPassword(email: String!): Boolean
        resetPassword(token: String!, newPassword: String!): Boolean
        deleteUser(id: String!): deleteResponse!
    }

    type deleteResponse {
        success: Boolean!
        message: String!
        id: String!
    }

`);
