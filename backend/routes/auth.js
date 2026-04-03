import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.join(__dirname, "../data/users.json");
const JWT_SECRET = process.env.JWT_SECRET || "hackathon_secret";

/* =====================
   HELPERS
===================== */
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

/* =====================
   REGISTER
===================== */
export const register = async (req, res) => {
  const { name, email, password, education, location } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const users = readUsers();
  const exists = users.find(u => u.email === email);

  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    name,
    email,
    password: hashed,
    education: education || "",
    location: location || ""
  };

  users.push(user);
  writeUsers(users);

  res.json({ message: "Registered successfully" });
};

/* =====================
   LOGIN
===================== */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const users = readUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
};

/* =====================
   GET PROFILE
===================== */
export const me = (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const users = readUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, ...safeUser } = user;
    res.json(safeUser);

  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

