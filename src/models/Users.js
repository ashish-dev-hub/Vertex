const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {name: {type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100},

    email: {type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true},
        
    password: {type: String,
            required: true,
            minlength: 6,
            select: false},

    role: {type: String,
            enum: ["student", "recruiter"],
            required: true}
    },
    {timestamps: true}
);
const User = mongoose.model("User", userSchema);
module.exports = User;