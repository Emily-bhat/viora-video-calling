import { Router } from "express";

const router = Router();

// example routes
router.get("/", (req, res) => {
    res.send("All users from v2");
});

router.post("/login", (req, res) => {
    res.send("Login v2");
});

router.post("/register", (req, res) => {
    res.send("Register v2");
});

export default router;