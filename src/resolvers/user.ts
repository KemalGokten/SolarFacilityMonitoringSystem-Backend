import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";

import { User } from "../model/user";

const SECRET_KEY = process.env.SECRET_KEY as string;
const EMAIL_USER = process.env.EMAIL_USER as string;
const EMAIL_PASS = process.env.EMAIL_PASS as string;
const ORIGIN = process.env.ORIGIN as string;

interface Args {
  id: string;
  username: string;
  email: string;
  password: string;
}

export const UsersResolver = {
  Query: {
    user: async (_: any, args: Args) => {
      try {
        if (!args.id) throw new Error("No id provided");
        const user = await User.findById(args.id);
        if (!user) throw new Error("No user found");
        return user;
      } catch (error) {
        throw error;
      }
    },
    verifyToken: async (_: any, __: any, context: { user: any }) => {
      if (!context.user) throw new Error("Not authenticated");
      return context.user;
    },
  },

  Mutation: {
    regUser: async (_: any, args: Args) => {
      try {
        const user = await User.findOne({ email: args.email });
        if (user) throw new Error("User already exists");
        const newUser = await User.create({
          username: args.username,
          email: args.email,
          password: args.password,
        });
        return newUser;
      } catch (error) {
        throw error;
      }
    },

    loginUser: async (_: any, args: Args) => {
      try {
        const user = await User.findOne({ email: args.email });
        if (!user) throw new Error("User not found");
        const isValid = await user.isValidPassword(args.password);
        if (!isValid) throw new Error("Invalid password");

        const token = jwt.sign(
          { id: user.id, email: user.email, username: user.username },
          SECRET_KEY,
          {
            expiresIn: "6h",
          }
        );

        return { user, token };
      } catch (error) {
        throw error;
      }
    },

    updateUser: async (_: any, args: Args) => {
      try {
        const id = args.id;
        if (!id) throw new Error("No id provided");
        const user = await User.findById(args.id);
        if (!user) throw new Error("User not found");
        const updateUser = await User.findByIdAndUpdate(
          id,
          { ...args },
          { new: true, runValidators: true }
        );
        return updateUser;
      } catch (error) {
        throw error;
      }
    },

    deleteUser: async (_: any, args: Args) => {
      try {
        const id = args.id;
        if (!id) throw new Error("No id provided");
        const user = await User.findById(args.id);
        if (!user) throw new Error("User not found");
        const deleteUser = await User.findByIdAndDelete(id);
        return {
          success: true,
          message: "User deleted successfully",
          id: deleteUser?._id,
        };
      } catch (error) {
        throw error;
      }
    },
    forgotPassword: async (_: any, { email }: { email: string }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        // Create a JWT token
        const resetToken = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: "5m",
        });

        // Send the reset email
        const transporter = nodemailer.createTransport({
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

        await transporter.sendMail({
          to: email,
          from: process.env.EMAIL_USER,
          subject: "Solar Facility App Password Reset",
          html: `<p>To reset your password, click <a href="${resetUrl}">here</a>.</p>`,
        });

        return true;
      } catch (error) {
        throw error;
      }
    },

    resetPassword: async (
      _: any,
      { token, newPassword }: { token: string; newPassword: string }
    ) => {
      try {
        let userId: string;

        try {
          const payload = jwt.verify(token, SECRET_KEY) as { id: string };
          userId = payload.id;
        } catch (e) {
          throw new Error("Invalid or expired token");
        }

        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // Update the user password
        user.password = newPassword;
        await user.save();

        return true;
      } catch (error) {
        throw error;
      }
    },
  },
};
