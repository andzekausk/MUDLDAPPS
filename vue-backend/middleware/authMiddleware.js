const { verifyToken } = require("../services/authService");

async function authenticateUser(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const user = await verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}

function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !req.user.roles.some(role => allowedRoles.includes(role))) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
        next();
    };
}

module.exports = { authenticateUser, authorizeRole };
