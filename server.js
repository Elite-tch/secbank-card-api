const express = require("express");
const Database = require("better-sqlite3");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = require("./swagger");

const app = express();
const db = new Database("secbank.db");

app.use(express.json());

// Create the card requests table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS card_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference TEXT UNIQUE,
    customer_id TEXT,
    customer_name TEXT,
    card_type TEXT,
    status TEXT DEFAULT 'PENDING'
  )
`);

// Create a new card request
app.post("/card-requests", (req, res) => {
  const { customer_id, customer_name, card_type } = req.body;

  // Check that the required details were provided
  if (!customer_id || !customer_name || !card_type) {
    return res.status(400).json({
      error: "Please provide customer_id, customer_name and card_type"
    });
  }

  // Check that card_type is either DEBIT or CREDIT
  if (card_type !== "DEBIT" && card_type !== "CREDIT") {
    return res.status(400).json({
      error: "card_type must be DEBIT or CREDIT"
    });
  }

  // Create a unique reference for the card request
  const reference = "CARD-" + Date.now();

  // Save the card request in the database
  db.prepare(`
    INSERT INTO card_requests (reference, customer_id, customer_name, card_type)
    VALUES (?, ?, ?, ?)
  `).run(reference, customer_id, customer_name, card_type);

  // Send success response
  res.status(201).json({
    message: "Card request created successfully",
    reference: reference,
    status: "PENDING"
  });
});

// Check card request status
app.get("/card-requests/:reference", (req, res) => {
  const reference = req.params.reference;

  // Find the card request using its reference
  const cardRequest = db.prepare(`
    SELECT * FROM card_requests WHERE reference = ?
  `).get(reference);

  // If no card request is found, return an error
  if (!cardRequest) {
    return res.status(404).json({
      error: "Card request not found"
    });
  }

  // Return the card request details
  res.json(cardRequest);
});

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
  console.log("Swagger documentation: http://localhost:4000/api-docs");
});