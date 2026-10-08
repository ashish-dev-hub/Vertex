const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


const register = async (req, res) => {
    try { const {name,email,password,role} = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"});
        }

        if (!["student", "recruiter"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"});
        }

const existingUser = await User.findOne({email: email.toLowerCase()});

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

const hashedPassword = await bcrypt.hash(password,12);
const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role
        });

const token = generateToken(user);
    return res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {id: user._id,
            name: user.name,
            email: user.email,
            role: user.role}
        });
    }
    catch (error) {console.error("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"});
    }
};

const login = async (req, res) => {
    try {const {email,password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"});
        }

const user = await User.findOne({email: email.toLowerCase()}).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"});
        }

const passwordMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"});
        }

const token = generateToken(user);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role}
        });

    } 
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getMe = async (req, res) => {
    try {const user = await User.findById(req.user.userId);
        if (!user) 
            {return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {id: user._id,
                name: user.name,
                email: user.email,
                role: user.role}
        });

    } 
    catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {register,login,getMe};