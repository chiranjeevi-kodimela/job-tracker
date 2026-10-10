const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");
const { sendPasswordResetEmail } = require("../utils/mailer");
const {
  normalizeEmail,
  isValidEmail,
  validatePassword,
} = require("../utils/validators");

const RESET_TOKEN_MINUTES = 60;

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !name.trim() || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const [existingUsers] = await db.query(
      "select id from users where email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "insert into users (name, email, password_hash) values (?, ?, ?)",
      [name.trim(), email, passwordHash],
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await db.query("select * from users where email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const GENERIC_FORGOT_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const [users] = await db.query(
      "select id, name, email from users where email = ?",
      [email],
    );

    if (users.length > 0) {
      const user = users[0];
      const token = crypto.randomBytes(32).toString("hex");

      // Only one active reset link per user
      await db.query("delete from password_resets where user_id = ?", [
        user.id,
      ]);

      await db.query(
        `insert into password_resets (user_id, token_hash, expires_at)
         values (?, ?, date_add(utc_timestamp(), interval ? minute))`,
        [user.id, hashToken(token), RESET_TOKEN_MINUTES],
      );

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      try {
        await sendPasswordResetEmail({
          to: user.email,
          name: user.name,
          resetUrl,
        });
      } catch (mailError) {
        console.error("Failed to send password reset email:", mailError);
      }
    }

    res.json({ message: GENERIC_FORGOT_MESSAGE });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const [resets] = await db.query(
      `select id, user_id from password_resets
       where token_hash = ? and expires_at > utc_timestamp()`,
      [hashToken(token)],
    );

    if (resets.length === 0) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired",
      });
    }

    const { user_id: userId } = resets[0];
    const passwordHash = await bcrypt.hash(password, 10);

    await db.query("update users set password_hash = ? where id = ?", [
      passwordHash,
      userId,
    ]);

    await db.query("delete from password_resets where user_id = ?", [userId]);

    res.json({ message: "Password has been reset. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
