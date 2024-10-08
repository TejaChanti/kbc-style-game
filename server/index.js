const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://192.168.0.5:3000",
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://192.168.0.5:3000",
    methods: ["GET", "POST"],
  },
});

// Questions array
const questions = [
  {
    question: "What is the capital of France?",
    options: { A: "Berlin", B: "Madrid", C: "Paris", D: "Lisbon" },
    correct: "C",
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: { A: "Shakespeare", B: "Dante", C: "Tolstoy", D: "Homer" },
    correct: "A",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: { A: "Earth", B: "Mars", C: "Venus", D: "Jupiter" },
    correct: "B",
  },
  {
    question: "What is the largest mammal?",
    options: { A: "Elephant", B: "Whale", C: "Rhino", D: "Giraffe" },
    correct: "B",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: { A: "Da Vinci", B: "Van Gogh", C: "Picasso", D: "Rembrandt" },
    correct: "A",
  },
];

let currentQuestionIndex = 0;
let players = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("player-join", (playerName) => {
    players.push({ id: socket.id, name: playerName });
    io.emit("update-players", players);

    io.emit("next-question", questions[currentQuestionIndex]);
  });

  socket.on("answer-submitted", ({ playerName, answer }) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (answer === currentQuestion.correct) {
      io.emit("correct-answer", { playerName, question: currentQuestion });

      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        setTimeout(() => {
          io.emit("next-question", questions[currentQuestionIndex]);
        }, 3000);
      } else {
        currentQuestionIndex = 0;
        io.emit("game-over", { message: "No more questions!" });
      }
    } else {
      socket.emit("wrong-answer", { correctAnswer: currentQuestion.correct });
    }
  });

  socket.on("disconnect", () => {
    players = players.filter((player) => player.id !== socket.id);
    io.emit("update-players", players);
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
