import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";

let chats = [
  {
    subject: "Subject #1",
    description: "Random chat description",
    messages: [{ sender: { email: "luka1@gmail.com", first_name: "Luka", last_name: "Koridz" }, text: "Hi, I'm having trouble with my account." }],
  },
];

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up a basic route for testing
app.get("/", (req, res) => {
  res.send("Chat App Backend");
});

app.get("/chats", (req, res) => {
  res.json(chats);
});

// Set up Socket.io for chat functionality
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat messages
  socket.on("chat message", (msg) => {
    chats[0].messages.push(msg);
    io.emit("chat message", msg);
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
