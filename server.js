// Import required packages/modules
const express = require("express"); // Express framework for creating the server
const mongoose = require("mongoose"); // Mongoose for MongoDB object modeling
const bodyParser = require("body-parser"); // Middleware to parse request bodies
const cors = require("cors"); // Import the cors middleware

// Create an instance of the Express application
const app = express();

app.use(cors());

// Define the port number where the server will listen
const PORT = 4000;

// Connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/UserInformation", { // Connect to MongoDB database named UserInformation
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true // Use new server discovery and monitoring engine
}).then(() => { // Promise for successful connection
  console.log("Connected with MongoDB"); // Log success message
}).catch((err) => { // Promise for connection error
  console.error("MongoDB connection error:", err); // Log error message
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Define the schema for data stored in the MongoDB collection
const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, // Name field as string
  phone: {
    type: Number,
    required: true
  }, // Class field as number
  city: {
    type: String,
    required: true
  }, // Roll field as number
  dateAndTime: {
    type: String,
    // required: true,
    default: () => new Date().toString() 
  }
});


// Create a model based on the schema
const Data = mongoose.model("Data", dataSchema); // Model named "Data" based on dataSchema

// Endpoint to create new data
app.post("/api/v1/data/new", async (req, res) => { // POST request handler for creating new data
  try { // Try block to handle potential errors
    const data = await Data.create(req.body); // Create new data from request body
    res.status(201).json({ success: true, data }); // Respond with success message and created data
  } catch (error) { // Catch block for handling errors
    res.status(500).json({ success: false, error: error.message }); // Respond with error message
  }
});

// Endpoint to read all data
app.get("/api/v1/datas", async (req, res) => { // GET request handler for reading all data
  try { // Try block to handle potential errors
    const datas = await Data.find(); // Find all data in the collection
    res.status(200).json({ success: true, datas }); // Respond with success message and retrieved data
  } catch (error) { // Catch block for handling errors
    res.status(500).json({ success: false, error: error.message }); // Respond with error message
  }
});

// Endpoint to update data by ID
app.put("/api/v1/data/:id", async (req, res) => { // PUT request handler for updating data by ID
  try { // Try block to handle potential errors
    let data = await Data.findByIdAndUpdate(req.params.id, req.body, { // Find and update data by ID
      new: true, // Return the modified document rather than the original
      useFindAndModify: false, // Uses findOneAndUpdate() instead of findAndModify()
      runValidators: true // Run update validators on this command
    });
    if (!data) { // If no data found with the specified ID
      return res.status(404).json({ success: false, message: "Data not found" }); // Respond with error message
    }
    res.status(200).json({ success: true, data }); // Respond with success message and updated data
  } catch (error) { // Catch block for handling errors
    res.status(500).json({ success: false, error: error.message }); // Respond with error message
  }
});

// Endpoint to delete data by ID
app.delete("/api/v1/data/:id", async (req, res) => { // DELETE request handler for deleting data by ID
  try { // Try block to handle potential errors
    const data = await Data.findByIdAndDelete(req.params.id); // Find and delete data by ID
    if (!data) { // If no data found with the specified ID
      return res.status(404).json({ success: false, message: "Data not found" }); // Respond with error message
    }
    res.status(200).json({ success: true, message: "Data deleted successfully" }); // Respond with success message
  } catch (error) { // Catch block for handling errors
    res.status(500).json({ success: false, error: error.message }); // Respond with error message
  }
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log server start message
});
