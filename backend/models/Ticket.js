


const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        department: {
    type: String,
    required: true,
    trim: true
},
        category: {
            type: String,
            required: true,
            enum: [
                "Technical",
                "Hardware",
                "Software",
                "Network",
                "Account",
                "Other"
            ]
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Open",
                "Assigned",
                "In Progress",
                "Waiting for Employee",
                "Resolved",
                "Closed"
            ],
            default: "Open"
        },

        slaDeadline: {
            type: Date,
            default: null
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        attachment: {
            type: String,
            default: ""
        },

        resolution: {
            type: String,
            default: ""
        },
        resolvedAt: {
    type: Date,
    default: null
},

        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },

                message: {
                    type: String,
                    required: true,
                    trim: true
                },

                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Ticket", ticketSchema);