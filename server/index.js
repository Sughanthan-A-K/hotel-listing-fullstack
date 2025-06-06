import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import pool from './db.js';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve image paths

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ------------------ Routes ------------------ //

// Create a hotel
app.post("/api/hotels", upload.single("hotel_image"), async (req, res) => {
  try {
    const { title, description, latitude, longitude, price } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    if ( !title || !latitude || !longitude || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO hotels (hotel_image_url, hotel_title, hotel_description, hotel_latitude, hotel_longitude, hotel_price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [`/uploads/${image.filename}`, title, description, latitude, longitude, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Edit hotel~
app.put('/api/hotels/:id', upload.single("hotel_image"), async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let index = 1;

    if (req.body.title) {
      fields.push(`hotel_title = $${index++}`);
      values.push(req.body.title);
    }
    if (req.body.description) {
      fields.push(`hotel_description = $${index++}`);
      values.push(req.body.description);
    }
    if (req.body.latitude) {
      fields.push(`hotel_latitude = $${index++}`);
      values.push(req.body.latitude);
    }
    if (req.body.longitude) {
      fields.push(`hotel_longitude = $${index++}`);
      values.push(req.body.longitude);
    }
    if (req.body.price) {
      fields.push(`hotel_price = $${index++}`);
      values.push(req.body.price);
    }
    if (req.file) {
      fields.push(`hotel_image_url = $${index++}`);
      values.push(`/uploads/${req.file.filename}`);
    }

    fields.push(`hotel_updated_at = CURRENT_TIMESTAMP`);

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const query = `
      UPDATE hotels
      SET ${fields.join(', ')}
      WHERE hotel_id = $${index}
      RETURNING *;
    `;
    values.push(id);

    const result = await pool.query(query, values);
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete hotel
app.delete("/api/hotels/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await pool.query("SELECT * FROM hotels WHERE hotel_id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).send("Hotel not found");

    const imagePath = `.${existing.rows[0].hotel_image_url}`;
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await pool.query("DELETE FROM hotels WHERE hotel_id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get hotels with filters
app.get("/api/hotels", async (req, res) => {
  try {
    const { title, minPrice, maxPrice, offset = 0, limit = 10 } = req.query;

    let baseQuery = `SELECT * FROM hotels WHERE 1=1`;
    const values = [];
    let count = 1;

    if (title) {
      baseQuery += ` AND hotel_title ILIKE $${count++}`;
      values.push(`%${title}%`);
    }
    if (minPrice) {
      baseQuery += ` AND hotel_price >= $${count++}`;
      values.push(minPrice);
    }
    if (maxPrice) {
      baseQuery += ` AND hotel_price <= $${count++}`;
      values.push(maxPrice);
    }

    baseQuery += ` ORDER BY hotel_created_at DESC LIMIT $${count++} OFFSET $${count++}`;
    values.push(limit, offset);

    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
