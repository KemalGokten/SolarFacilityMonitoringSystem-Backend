import { buildSchema } from "graphql";

export const usersGQLSchema = buildSchema(`
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
