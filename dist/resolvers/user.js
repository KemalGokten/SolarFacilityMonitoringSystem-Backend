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
exports.UsersResolver = void 0;
const user_1 = require("../model/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const SECRET_KEY = process.env.SECRET_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const ORIGIN = process.env.ORIGIN;
exports.UsersResolver = {
    Query: {
        user: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!args.id)
                    throw new Error("No id provided");
                const user = yield user_1.User.findById(args.id);
                if (!user)
                    throw new Error("No user found");
                return user;
            }
            catch (error) {
                throw error;
            }
        }),
        verifyToken: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            if (!context.user)
                throw new Error("Not authenticated");
            return context.user;
        }),
    },
    Mutation: {
        regUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findOne({ email: args.email });
                if (user)
                    throw new Error("User already exists");
                const newUser = yield user_1.User.create({
                    username: args.username,
                    email: args.email,
                    password: args.password,
                });
                return newUser;
            }
            catch (error) {
                throw error;
            }
        }),
        loginUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findOne({ email: args.email });
                if (!user)
                    throw new Error("User not found");
                const isValid = yield user.isValidPassword(args.password);
                if (!isValid)
                    throw new Error("Invalid password");
                const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username }, SECRET_KEY, {
                    expiresIn: "6h",
                });
                return { user, token };
            }
            catch (error) {
                throw error;
            }
        }),
        updateUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = args.id;
                if (!id)
                    throw new Error("No id provided");
                const user = yield user_1.User.findById(args.id);
                if (!user)
                    throw new Error("User not found");
                const updateUser = yield user_1.User.findByIdAndUpdate(id, Object.assign({}, args), { new: true, runValidators: true });
                return updateUser;
            }
            catch (error) {
                throw error;
            }
        }),
        deleteUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = args.id;
                if (!id)
                    throw new Error("No id provided");
                const user = yield user_1.User.findById(args.id);
                if (!user)
                    throw new Error("User not found");
                const deleteUser = yield user_1.User.findByIdAndDelete(id);
                return {
                    success: true,
                    message: "User deleted successfully",
                    id: deleteUser === null || deleteUser === void 0 ? void 0 : deleteUser._id,
                };
            }
            catch (error) {
                throw error;
            }
        }),
        forgotPassword: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email }) {
            try {
                const user = yield user_1.User.findOne({ email });
                if (!user)
                    throw new Error("User not found");
                // Create a JWT token
                const resetToken = jsonwebtoken_1.default.sign({ id: user.id }, SECRET_KEY, {
                    expiresIn: "5m",
                });
                // Send the reset email
                const transporter = nodemailer_1.default.createTransport({
                    service: "Gmail",
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // Use `true` for port 465, `false` for all other ports
                    auth: {
                        user: EMAIL_USER,
                        pass: EMAIL_PASS,
                    },
                });
                console.log("process.env.ORIGIN" + process.env.ORIGIN);
                const resetUrl = `${ORIGIN}/auth/reset-password/${resetToken}`;
                yield transporter.sendMail({
                    to: email,
                    from: process.env.EMAIL_USER,
                    subject: "Solar Facility App Password Reset",
                    html: `<p>To reset your password, click <a href="${resetUrl}">here</a>.</p>`,
                });
                return true;
            }
            catch (error) {
                throw error;
            }
        }),
        resetPassword: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { token, newPassword }) {
            try {
                let userId;
                try {
                    const payload = jsonwebtoken_1.default.verify(token, SECRET_KEY);
                    userId = payload.id;
                }
                catch (e) {
                    throw new Error("Invalid or expired token");
                }
                const user = yield user_1.User.findById(userId);
                if (!user)
                    throw new Error("User not found");
                // Update the user password
                user.password = newPassword;
                yield user.save();
                return true;
            }
            catch (error) {
                throw error;
            }
        }),
    },
};
