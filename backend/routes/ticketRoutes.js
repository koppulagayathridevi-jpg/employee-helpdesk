const express = require("express");
const multer = require("multer");
const path = require("path");

const authMiddleware = require("../middleware/authMiddleware");

const {
    createTicket,
    getMyTickets,
    getTicketDetails,
    getAgentTickets,
    assignTicket,
    acceptTicket,
    updateTicketStatus,
    updateTicketPriority,
    addTicketComment,
    transferTicket,
    addResolution,
    confirmResolution,
    reopenTicket
    
} = require("../controllers/ticketController");

const router = express.Router();


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1E9);

//     cb(
//       null,
//       uniqueName + path.extname(file.originalname)
//     );
//   }
// });

// const upload = multer({
//   storage
// });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});

// ==========================================
// EMPLOYEE TICKET ROUTES
// ==========================================

// router.post(
//     "/",
//     authMiddleware,
//     createTicket
// );

router.post(
    "/",
    authMiddleware,
    upload.single("attachment"),
    createTicket
);

router.get(
    "/",
    authMiddleware,
    getMyTickets
);


// ==========================================
// SUPPORT AGENT ROUTES
// ==========================================

// Get all tickets for support agents
router.get(
    "/agent/all",
    authMiddleware,
    getAgentTickets
);


// Assign ticket
router.put(
    "/:id/assign",
    authMiddleware,
    assignTicket
);


// Accept assigned ticket
router.put(
    "/:id/accept",
    authMiddleware,
    acceptTicket
);


// Update ticket status
router.put(
    "/:id/status",
    authMiddleware,
    updateTicketStatus
);

router.put(
    "/:id/priority",
    authMiddleware,
    updateTicketPriority
);

router.post(
  "/:id/comments",
  authMiddleware,
  addTicketComment
);


router.put(
  "/:id/transfer",
  authMiddleware,
  transferTicket
);

router.put(
    "/:id/resolve",
    authMiddleware,
    addResolution
);

router.put("/:id/confirm", authMiddleware, confirmResolution);

router.put("/:id/reopen", authMiddleware, reopenTicket);

// ==========================================
// TICKET DETAILS
// ==========================================

router.get(
    "/:id",
    authMiddleware,
    getTicketDetails
);


module.exports = router;