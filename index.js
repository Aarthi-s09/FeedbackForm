const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Set Mongoose option to suppress deprecation warning
mongoose.set('strictQuery', true);

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, required: true }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Function to connect to the database
async function connectToDb() {
  try {
    await mongoose.connect('mongodb+srv://Aarthis09:Aarthi1234@cluster0.kexotzh.mongodb.net/HospitalAppointment?retryWrites=true&w=majority&appName=Cluster00', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('DB Connection established');

    // Start the server
    const port = process.env.PORT || 8002;
    app.listen(port, function () {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Couldn't establish connection");
  }
}

// Connect to the database
connectToDb();

// Endpoint to create a new feedback entry
app.post('/feedback', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;

    const newFeedback = new Feedback({
      name,
      email,
      feedback
    });

    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Endpoint to fetch all feedback entries
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});
