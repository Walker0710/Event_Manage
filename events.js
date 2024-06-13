import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Events API
// In-memory data store
let events = [
  {
    id: 1,
    name: "Battle Of Bands",
    venue:
      "Old Mess Lawn",
    time: "9:00 - 12:00 AM, 15 Feb", 
  },
  {
    id: 2,
    name: "Group Dance",
    venue:
      "Auditoriam",
    time: "1:00 - 3:00 PM, 15 Feb", 
  },
  {
    id: 3,
    name: "Prom Night",
    venue:
      "Old Mess Lawn",
    time: "8:00 - 11:00 PM, 15 Feb", 
  },
  {
    id: 4,
    name: "Sugar Rocketry",
    venue:
      "Football Ground",
    time: "9:00 - 11:00 AM, 16 Feb", 
  },
  {
    id: 5,
    name: "Freestyle",
    venue:
      "Auditorium",
    time: "12:00 - 2:00 PM, 16 Feb", 
  },
];

let lastEventId = 5;


//GET All events 
app.get("/events", (req, res) => {
  console.log(events);
  res.json(events);
});

//POST a new event
app.post("/addevent", (req, res) => {
  const newId = lastEventId += 1;
  const event = {
    id: newId,
    name: req.body.name,
    venue: req.body.venue,
    time: req.body.time,
  };
  lastEventId = newId;
  events.push(event);
  res.status(201).json(event);
});

app.delete("/deleteevent", (req, res) => {
  const id = parseInt(req.body.id);
  const index = events.findIndex((p) => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Event not found" });

  events.splice(index, 1);
  res.json({ message: "Event deleted" });
});

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
});
  
