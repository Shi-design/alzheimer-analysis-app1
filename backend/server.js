require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { connectDB, mongoose } = require("./config/db");

const app = express();

/* ---------------- CORS ---------------- */
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ---------------- Body Parser ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- Health Checks ---------------- */
app.get("/", (_req, res) => res.send("✅ Alzheimer API is running"));
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/health/db", (_req, res) =>
  res.json({ readyState: mongoose.connection.readyState })
);

/* ---------------- Upload Route ---------------- */
const ML_API_URL = process.env.ML_API_URL || "";
if (!ML_API_URL) console.warn("⚠️ ML_API_URL not set. Requests will fail.");

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post(
  "/api/analysis/upload",
  upload.fields([
    { name: "mri", maxCount: 1 },
    { name: "voice", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const mri = req.files?.mri?.[0];
      const voice = req.files?.voice?.[0];
      if (!mri || !voice)
        return res
          .status(400)
          .json({ error: "Both MRI and voice files are required." });

      const quizScore = req.body.quizScore ?? "0";

      const fd = new FormData();
      fd.append("mri", mri.buffer, {
        filename: mri.originalname || "mri.jpg",
        contentType: mri.mimetype || "image/jpeg",
      });
      fd.append("voice", voice.buffer, {
        filename: voice.originalname || "voice.wav",
        contentType: voice.mimetype || "audio/wav",
      });
      fd.append("quizScore", quizScore);

      const response = await axios.post(`${ML_API_URL}/analyze`, fd, {
        headers: fd.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });

      return res.status(200).json(response.data);
    } catch (e) {
      const details = e?.response?.data || e.message || "Unknown error";
      console.error("❌ ML analysis failed:", details);
      return res.status(500).json({ error: "ML analysis failed", details });
    }
  }
);

/* ---------------- Error Handler ---------------- */
app.use((err, _req, res, _next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ error: err.message || "Server error" });
});

/* ---------------- Start Server ---------------- */
const PORT = process.env.PORT || 5000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Backend listening on port ${PORT}`))
);
