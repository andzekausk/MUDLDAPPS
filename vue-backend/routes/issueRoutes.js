const express = require("express");
const {
    createIssue,
    createIssueComputers,
    getIssues,
    getIssueById,
    getComputersForIssue
} = require("../services/issueService");

const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

router.get("/issues", authenticateUser, async (req, res) => {
    try {
        const issues = await getIssues();
        res.json({ issues });
    } catch (error) {
        console.error("Error fetching issues:", error);
        res.status(500).json({ message: "Error fetching issues" });
    }
});

router.get("/issues/:id", authenticateUser, async (req, res) => {
    try {
        const issue = await getIssueById(req.params.id);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }
        const computers = await getComputersForIssue(issue.issue_id);
        res.json({ issue, computers });
    } catch (error) {
        console.error("Error fetching issue:", error);
        res.status(500).json({ message: "Error fetching issue" });
    }
});

router.post("/issues", authenticateUser, authorizeRole(["lietotājs"]), async (req, res) => {
    try {
        const { user_id, title, description, status, computer_ids } = req.body;

        const { issue_id } = await createIssue({ user_id, title, description, status });
        await createIssueComputers(issue_id, computer_ids);

        res.status(201).json({ issue_id });
    } catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({ message: "Error creating issue" });
    }
});

module.exports = router;