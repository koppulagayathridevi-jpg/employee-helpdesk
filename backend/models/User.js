// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true
//         },

//         password: {
//             type: String,
//             required: true
//         },

//         employeeId: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true
//         },

//         department: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         role: {
//     type: String,
//     enum: ["employee", "supportAgent", "manager", "admin"],
//     default: "employee"
// },

//         phone: {
//             type: String,
//             default: ""
//         },

//         profileImage: {
//             type: String,
//             default: ""
//         },

//         isActive: {
//             type: Boolean,
//             default: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: [
                "employee",
                "supportAgent",
                "manager",
                "admin"
            ],
            default: "employee"
        },

        phone: {
            type: String,
            default: ""
        },

        profileImage: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);