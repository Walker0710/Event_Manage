import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let notifications = [
    {
      id: 1,
      content: "Battle Of Bands is starting in 5 min",
      sendTime: "8:55 AM 15 Feb 2024", 
    },
    {
      id: 2,
      content: "Group Dance will start at 1:30 PM",
      sendTime: "10:56 AM 15 Feb 2024", 
    },
    {
      id: 3,
      content: "Hurry up guys prom night is starting in 10 min",
      sendTime: "8:07 PM 15 Feb 2024", 
    },
    {
      id: 4,
      content: "Venue for freestyle is changed to hostel circle",
      sendTime: "11:02 PM 15 Feb 2024", 
    },
  ];
  
  let lastNotifyId = 4;
  
  //GET All events
  app.get("/notifications", (req, res) => {
    console.log(events);
    res.json(notifications);
  });
  
  //POST a new notification
  app.post("/sendnotification", (req, res) => {
    const newId = lastNotifyId += 1;
    const noti = {
      id: newId,
      content: req.body.content,
      sendTime: req.body.sendTime,
    };
    lastEventId = newId;
    notifications.push(noti);
    res.status(201).json(noti);
  });
  
  
  app.delete("/deletenotification", (req, res) => {
    const id = parseInt(req.body.id);
    const index = notifications.findIndex((p) => p.id === id);
    if (index === -1) return res.status(404).json({ message: "event not found" });
  
    notifications.splice(index, 1);
    res.json({ message: "event deleted" });
  });
  
  
  app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });
  
  