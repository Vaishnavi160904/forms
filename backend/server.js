const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',        // Host where PostgreSQL is running
  database: 'forms',        // Update the database name here
  password: 'Vaish_os9',     // Your PostgreSQL password
  port: 5432,               // Default PostgreSQL port
});


app.use(bodyParser.json());
app.use(cors());

app.post("/add-employee", async (req, res) => {
  console.log("Incoming Data:", req.body); // Log incoming request body
  const { name, employeeId, email, phone, department, dateOfJoining, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO employees (name, employee_id, email, phone, department, date_of_joining, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, employeeId, email, phone, department, dateOfJoining, role]
    );
    res.status(201).json({ message: "Employee added successfully!", employee: result.rows[0] });
  } catch (err) {
    console.error("Database Error:", err.message); // Log database errors
    if (err.code === "23505") { // Handle duplicate errors
      res.status(400).json({ message: "Employee ID or Email already exists!" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
