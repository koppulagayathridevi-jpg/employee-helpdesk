const Ticket = require("../models/Ticket");
const User = require("../models/User");

// =====================================
// CREATE TICKET
// =====================================
const createTicket = async (req, res) => {
  try {
    const {
      title,
      department,
      category,
      priority,
      description
    } = req.body;

    if (!title || !department || !category || !description) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const ticket = await Ticket.create({
      title,
      department,
      category,
      priority: priority || "Medium",
      description,
      createdBy: req.user._id,
      attachment: req.file
        ? `/uploads/${req.file.filename}`
        : ""
    });

    await ticket.populate(
      "createdBy",
      "name email employeeId department"
    );

    res.status(201).json({
      message: "Ticket created successfully",
      ticket
    });

  } catch (error) {
    console.error("Create ticket error:", error);

    res.status(500).json({
      message: "Server error while creating ticket"
    });
  }
};


// =====================================
// GET MY TICKETS
// =====================================
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            createdBy: req.user._id
        })
            .populate("createdBy", "name email employeeId department")
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Tickets fetched successfully",
            count: tickets.length,
            tickets
        });

    } catch (error) {
        console.error("Get my tickets error:", error);

        res.status(500).json({
            message: "Server error while fetching tickets"
        });
    }
};

// =====================================
// GET TICKET DETAILS
// =====================================
const getTicketDetails = async (req, res) => {
    try {
        const { id } = req.params;

        let ticket;

        // Support Agent and Admin can view any ticket
        if (
            req.user.role === "supportAgent" ||
            req.user.role === "admin"
        ) {
            ticket = await Ticket.findById(id)
                .populate(
                    "createdBy",
                    "name email employeeId department"
                )
                .populate(
                    "assignedTo",
                    "name email employeeId department"
                );
        } else {
            // Employee can only view their own ticket
            ticket = await Ticket.findOne({
                _id: id,
                createdBy: req.user._id
            })
                .populate(
                    "createdBy",
                    "name email employeeId department"
                )
                .populate(
                    "assignedTo",
                    "name email employeeId department"
                );
        }

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            message: "Ticket details fetched successfully",
            ticket
        });

    } catch (error) {
        console.error(
            "Get ticket details error:",
            error
        );

        res.status(500).json({
            message: "Server error while fetching ticket details"
        });
    }
};
const getAgentTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate(
                "createdBy",
                "name email employeeId department"
            )
            .populate(
                "assignedTo",
                "name email employeeId department"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Agent tickets fetched successfully",
            count: tickets.length,
            tickets
        });
    } catch (error) {
        console.error("Get agent tickets error:", error);

        res.status(500).json({
            message: "Server error while fetching agent tickets"
        });
    }
};
const assignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        if (!assignedTo) {
            return res.status(400).json({
                message: "Support agent is required"
            });
        }

     const agent = await User.findOne({
    _id: assignedTo,
    role: "supportAgent",
    isActive: true
});

        if (!agent) {
            return res.status(404).json({
                message: "Support agent not found"
            });
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        ticket.assignedTo = agent._id;
        ticket.status = "Assigned";

        await ticket.save();

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Ticket assigned successfully",
            ticket
        });

    } catch (error) {
        console.error("Assign ticket error:", error);

        res.status(500).json({
            message: "Server error while assigning ticket"
        });
    }
};
const acceptTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (!ticket.assignedTo) {
            return res.status(400).json({
                message: "Ticket must be assigned before accepting"
            });
        }

        if (
            ticket.assignedTo.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "This ticket is assigned to another agent"
            });
        }

        if (ticket.status !== "Assigned") {
            return res.status(400).json({
                message: "Only assigned tickets can be accepted"
            });
        }

        ticket.status = "In Progress";

        await ticket.save();

        await ticket.populate(
            "createdBy",
            "name email employeeId department"
        );

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Ticket accepted successfully",
            ticket
        });

    } catch (error) {
        console.error("Accept ticket error:", error);

        res.status(500).json({
            message: "Server error while accepting ticket"
        });
    }
};

const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "Open",
            "Assigned",
            "In Progress",
            "Waiting for Employee",
            "Resolved",
            "Closed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid ticket status"
            });
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (!ticket.assignedTo) {
            return res.status(400).json({
                message: "Ticket must be assigned first"
            });
        }

        if (
            ticket.assignedTo.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only update tickets assigned to you"
            });
        }

        ticket.status = status;

        await ticket.save();

        await ticket.populate(
            "createdBy",
            "name email employeeId department"
        );

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Ticket status updated successfully",
            ticket
        });

    } catch (error) {
        console.error(
            "Update ticket status error:",
            error
        );

        res.status(500).json({
            message: "Server error while updating ticket status"
        });
    }
};

const updateTicketPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        const allowedPriorities = [
            "Low",
            "Medium",
            "High",
            "Critical"
        ];

        if (!allowedPriorities.includes(priority)) {
            return res.status(400).json({
                message: "Invalid ticket priority"
            });
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (!ticket.assignedTo) {
            return res.status(400).json({
                message: "Ticket must be assigned first"
            });
        }

        if (
            ticket.assignedTo.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only update tickets assigned to you"
            });
        }

        ticket.priority = priority;

        await ticket.save();

        await ticket.populate(
            "createdBy",
            "name email employeeId department"
        );

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Ticket priority updated successfully",
            ticket
        });

    } catch (error) {
        console.error(
            "Update ticket priority error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while updating ticket priority"
        });
    }
};

const addTicketComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Comment message is required"
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    // Employee can comment only on their own ticket
    if (
      req.user.role === "employee" &&
      ticket.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only comment on your own tickets"
      });
    }

    // Support agent can comment only on assigned ticket
    if (
      req.user.role === "supportAgent" &&
      ticket.assignedTo &&
      ticket.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only comment on tickets assigned to you"
      });
    }

    // ticket.comments.push({
    //   user: req.user._id,
    //   message: message.trim()
    // });

    if (!ticket.comments) {
    ticket.comments = [];
}

ticket.comments.push({
    user: req.user._id,
    message: message.trim()
});

    await ticket.save();

    await ticket.populate([
      {
        path: "comments.user",
        select: "name email role employeeId"
      },
      {
        path: "createdBy",
        select: "name email employeeId department"
      },
      {
        path: "assignedTo",
        select: "name email employeeId department"
      }
    ]);

    res.status(200).json({
      message: "Comment added successfully",
      ticket
    });

  } catch (error) {
    console.error("Add comment error:", error);

    res.status(500).json({
      message: "Server error while adding comment"
    });
  }
};

const transferTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        message: "Please select a support agent"
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    if (!ticket.assignedTo) {
      return res.status(400).json({
        message: "Ticket is not currently assigned"
      });
    }

    // Only the currently assigned agent can transfer
    if (
      ticket.assignedTo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the assigned agent can transfer this ticket"
      });
    }

    const newAgent = await User.findById(assignedTo);

    if (!newAgent) {
      return res.status(404).json({
        message: "Support agent not found"
      });
    }

    if (newAgent.role !== "supportAgent") {
      return res.status(400).json({
        message: "Selected user is not a support agent"
      });
    }

    ticket.assignedTo = newAgent._id;

    // After transfer, ticket becomes Assigned again
    ticket.status = "Assigned";

    await ticket.save();

    await ticket.populate(
      "createdBy",
      "name email employeeId department"
    );

    await ticket.populate(
      "assignedTo",
      "name email employeeId department"
    );

    res.status(200).json({
      message: "Ticket transferred successfully",
      ticket
    });

  } catch (error) {
    console.error("Transfer ticket error:", error);

    res.status(500).json({
      message: "Server error while transferring ticket"
    });
  }
};


const addResolution = async (req, res) => {
    try {
        const { id } = req.params;
        const { resolution } = req.body;

        if (!resolution || !resolution.trim()) {
            return res.status(400).json({
                message: "Resolution notes are required"
            });
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        if (
            req.user.role === "supportAgent" &&
            (!ticket.assignedTo ||
                ticket.assignedTo.toString() !== req.user._id.toString())
        ) {
            return res.status(403).json({
                message: "You can only resolve tickets assigned to you"
            });
        }

        ticket.resolution = resolution.trim();
        ticket.status = "Resolved";

        await ticket.save();

        await ticket.populate(
            "createdBy",
            "name email employeeId department"
        );

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Ticket resolved successfully",
            ticket
        });

    } catch (error) {
        console.error("Add resolution error:", error);

        res.status(500).json({
            message: "Server error while resolving ticket"
        });
    }
};



const confirmResolution = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        // Only the employee who created the ticket can confirm
        if (
            req.user.role === "employee" &&
            ticket.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only confirm your own tickets"
            });
        }

        // Ticket must be resolved first
        if (ticket.status !== "Resolved") {
            return res.status(400).json({
                message: "Ticket must be resolved before confirmation"
            });
        }

        ticket.status = "Closed";

        await ticket.save();

        await ticket.populate(
            "createdBy",
            "name email employeeId department"
        );

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Resolution confirmed. Ticket closed successfully",
            ticket
        });

    } catch (error) {
        console.error("Confirm resolution error:", error);

        res.status(500).json({
            message: "Server error while confirming resolution"
        });
    }
};


const reopenTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                message: "Ticket not found"
            });
        }

        // Only the employee who created the ticket can reopen it
        if (
            req.user.role === "employee" &&
            ticket.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only reopen your own tickets"
            });
        }

        // Ticket must be closed before reopening
        if (ticket.status !== "Closed") {
            return res.status(400).json({
                message: "Only closed tickets can be reopened"
            });
        }

        ticket.status = "Open";
        ticket.resolution = "";

        await ticket.save();

        await ticket.populate(
            "createdBy",
            "name email employeeId department"
        );

        await ticket.populate(
            "assignedTo",
            "name email employeeId department"
        );

        res.status(200).json({
            message: "Ticket reopened successfully",
            ticket
        });

    } catch (error) {
        console.error("Reopen ticket error:", error);

        res.status(500).json({
            message: "Server error while reopening ticket"
        });
    }
};


module.exports = {
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
    
    


};