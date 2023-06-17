
require('dotenv').config()
const cors = require('cors');
const express = require('express');
const mongodb = require('mongodb');
const {ObjectId } = require('mongodb');


const app = express();
app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());

// MongoDB connection string
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmmhgrv.mongodb.net/taskDB?retryWrites=true&w=majority`; // Replace with your MongoDB connection string

// Connect to MongoDB
mongodb.MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    const db = client.db('taskmanager');
    const tasksCollection = db.collection('tasks');

    // API endpoints
    app.get('/api/tasks', async (req, res) => {
      const tasks = await tasksCollection.find().toArray();
      res.json(tasks);
    });

    app.post('/api/tasks', async (req, res) => {
      const task = req.body;
      await tasksCollection.insertOne(task);
      res.status(201).send();
    });

    app.put('/api/tasks/:id', async (req, res) => {
      const taskId = req.params.id;
      const updatedTask = req.body;
      await tasksCollection.updateOne({ _id: new ObjectId(taskId) }, { $set: updatedTask });
      res.status(200).send();
    });

    app.delete('/api/tasks/:id', async (req, res) => {
      const taskId = req.params.id;
      console.log(taskId)
      await tasksCollection.deleteOne({ _id: new ObjectId(taskId) });
      res.status(200).send();
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
