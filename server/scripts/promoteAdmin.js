
const mongoose = require("mongoose");
const readline = require("readline");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Load environment variables from server/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Ask for normal terminal input
const askQuestion = (question) => {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

// Ask for the password without displaying typed characters
const askPassword = () => {
    return new Promise((resolve, reject) => {
        if (!process.stdin.isTTY || !process.stdin.setRawMode) {
            reject(new Error("Run this script in a terminal that supports hidden input"));
            return;
        }

        process.stdout.write("Enter your registered account password: ");

        let password = "";

        process.stdin.setEncoding("utf8");
        process.stdin.setRawMode(true);
        process.stdin.resume();

        const handleInput = (key) => {
            if (key === "\u0003") {
                process.stdin.removeListener("data", handleInput);
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdout.write("\n");
                reject(new Error("Password input cancelled"));
                return;
            }

            if (key === "\r" || key === "\n") {
                process.stdin.removeListener("data", handleInput);
                process.stdin.setRawMode(false);
                process.stdin.pause();
                process.stdout.write("\n");
                resolve(password);
                return;
            }

            if (key === "\u007f" || key === "\b") {
                password = password.slice(0, -1);
                return;
            }

            password += key;
        };

        process.stdin.on("data", handleInput);
    });
};

// Promote the first registered user to administrator
const promoteAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from server/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");

        // Prevent this first-admin setup script from creating additional admins
        const existingAdmin = await User.exists({ role: "admin" });

        if (existingAdmin) {
            throw new Error("An admin account already exists. First-admin setup is no longer available.");
        }

        const email = (
            await askQuestion("Enter the registered account email: ")
        ).trim().toLowerCase();

        const password = await askPassword();

        if (!email || password.length < 8) {
            throw new Error("Email is required and password must be at least 8 characters");
        }

        const user = await User.findOne({ email }).select("+passwordHash");

        if (!user) {
            throw new Error("No registered account found with this email");
        }

        if (user.accountStatus !== "active") {
            throw new Error("Only active accounts can be promoted");
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            throw new Error("The password does not match the registered account");
        }

        user.role = "admin";
        await user.save();

        console.log(`Successfully promoted ${user.email} to admin`);

    } catch (error) {
        console.error("Admin Promotion Failed:", error.message);
        process.exitCode = 1;

    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log("MongoDB Disconnected");
        }
    }
};

promoteAdmin();
