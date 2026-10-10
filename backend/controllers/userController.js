const bcrypt = require("bcryptjs");

const db = require("../config/db");
const {
  normalizeEmail,
  isValidEmail,
  validatePassword,
} = require("../utils/validators");

const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = normalizeEmail(req.body.email);

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    if (name.length > 100) {
      return res
        .status(400)
        .json({ message: "Name must be 100 characters or fewer" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id <> ?",
      [email, req.user.userId],
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const [result] = await db.query(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, req.user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [users] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.userId],
    );

    res.json({ message: "Profile updated successfully", user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from the current password",
      });
    }

    const [users] = await db.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const matches = await bcrypt.compare(
      currentPassword,
      users[0].password_hash,
    );

    if (!matches) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      passwordHash,
      req.user.userId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe, updateProfile, changePassword };
