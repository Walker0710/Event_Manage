import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 5000;
const EVENTS_URL = "http://localhost:5000";
const NOTIFICATIONS_URL = "http://localhost:5000";

const db = new pg.Client({
  user: "Milan_owner",
  host: "ep-polished-smoke-a12sfj0v.ap-southeast-1.aws.neon.tech",
  database: "EventRadar",
  password: "yXv7R6fGMABz",
  port: 5432,
  ssl: "true",
});

db.connect();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.json());

app.get("/public/style.css", (req, res) => {
  res.sendFile(__dirname + "/public/style.css");
});

app.use('/images', express.static(__dirname + '/images'));


// Route to render the login register page
app.get("/", (req, res) => {
  res.render("firstPage.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Route to post the register data
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      const result = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
        [name, email, password]
      );
      console.log(result);
      res.redirect("/home");
    }
  } catch (err) {
    console.log(err);
  }
});

// Route to check the register page
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        // res.sendFile(__dirname + "/views/home.html");
        res.redirect("/home")
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.redirect("/register");
    }
  } catch (err) {
    console.log(err);
  }
});




// Route to render the home page
app.get("/home", (req, res) => {
  res.render("home.ejs");
});




//    Events

// Route to render the events page
app.get("/logintoaddevent", (req, res) => {
  res.render("loginToAddEvent.ejs");
});

app.get("/events", async (req, res) => {
  try {
    const response = await axios.get(`${EVENTS_URL}/events`);
    console.log(response);
    res.render("events.ejs", { events: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.post("/logintoaddevent", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    const storedPassword = user.password;

    if (password === storedPassword) {
      // res.sendFile(__dirname + "/views/home.html");
      res.redirect("/addevent")
    } else {
      res.send("Incorrect Password");
    }
  }

  catch (err) {
    console.log(err);
  }
});

// Route to render the add event page
app.get("/addevent", async (req, res) => {
  res.render("addevent.ejs");
});

// add a event
app.post("/api/addevent", async (req, res) => {
  try {
    const response = await axios.post(`${EVENTS_URL}/addevent`, req.body);
    console.log(response.data);
    res.redirect("/events");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

app.get("/logintodeleteevent", (req, res) => {
  res.render("loginToDeleEvent.ejs");
});

app.post("/logintodeleteevent", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    const storedPassword = user.password;

    if (password === storedPassword) {
      // res.sendFile(__dirname + "/views/home.html");
      res.redirect("/deleteevent")
    } else {
      res.send("Incorrect Password");
    }
  }

  catch (err) {
    console.log(err);
  }
});

app.get("/deleteevent", (req, res) => {
  res.render("deleteEvent.ejs");
});


app.post("/api/deleteevent", async (req, res) => {
  try {
    const id = req.body.id;
    await axios.delete(`${EVENTS_URL}/deleteevent`, { data: { id } });
    res.redirect("/events");
  } catch (error) {
    res.status(500).json({ message: "Error deleting event" });
  }
});


//   Notification

// Route to render the notifications page
app.get("/logintoaddnoti", (req, res) => {
  res.render("loginToAddNoti.ejs");
});

app.get("/notifications", async (req, res) => {
  try {
    const response = await axios.get(`${NOTIFICATIONS_URL}/notifications`);
    console.log(response);
    res.render("notifications.ejs", { notifications: response.data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/sendnotification", async (req, res) => {
  res.render("sendnotification.ejs");
});

app.post("/logintoaddnoti", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    const storedPassword = user.password;

    if (password === storedPassword) {
      // res.sendFile(__dirname + "/views/home.html");
      res.redirect("/sendnotification")
    } else {
      res.send("Incorrect Password");
    }
  }

  catch (err) {
    console.log(err);
  }
});

// add the notification
app.post("/api/sendnotification", async (req, res) => {
  try {
    const response = await axios.post(`${NOTIFICATIONS_URL}/sendnotification`, req.body);
    console.log(response.data);
    res.redirect("/notifications");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

app.get("/logintodeletenotification", (req, res) => {
  res.render("loginToDeleNoti.ejs");
});

app.post("/logintodeletenotification", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    const user = result.rows[0];
    const storedPassword = user.password;

    if (password === storedPassword) {
      // res.sendFile(__dirname + "/views/home.html");
      res.redirect("/deletenotification")
    } else {
      res.send("Incorrect Password");
    }
  }

  catch (err) {
    console.log(err);
  }
});

app.get("/deletenotification", (req, res) => {
  res.render("deleteNotification.ejs");
});


app.post("/api/deletenotification", async (req, res) => {
  try {
    const id = req.body.id;
    await axios.delete(`${NOTIFICATIONS_URL}/deletenotification`, { data: { id } });
    res.redirect("/notifications");
  } catch (error) {
    console.log("error is ", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
