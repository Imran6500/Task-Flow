const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 150
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: ["TODO", "IN_PROGRESS", "DONE"],
            default: "TODO"
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM"
        },

        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },

        dueDate: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Useful for fetching tasks belonging to a project
taskSchema.index({ projectId: 1, createdAt: -1, _id: -1 });

module.exports = mongoose.model("Task", taskSchema);