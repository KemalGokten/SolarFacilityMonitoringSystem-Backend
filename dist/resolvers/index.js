"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const user_1 = require("./user");
const facility_1 = __importDefault(require("./facility"));
exports.resolvers = [user_1.UsersResolver, facility_1.default];
