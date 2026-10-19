const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        passwordHash: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },
        
    },
    {
        timestamps: true
    }
);

// Database-enforced email uniqueness
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);