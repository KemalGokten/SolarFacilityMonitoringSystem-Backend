"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedGQLSchema = void 0;
const merge_1 = require("@graphql-tools/merge");
const user_1 = require("./user");
const facility_1 = require("./facility");
exports.mergedGQLSchema = (0, merge_1.mergeTypeDefs)([user_1.usersGQLSchema, facility_1.facilitiesGQLSchema]);
