import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./style.css";

const socket = io("http://192.168.0.5:4000");

function PlayerScreen() {
  const [playerName, setPlayerName] = useState("");
  const [joined, setJoined] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    socket.on("next-question", (newQuestion) => {
      console.log(newQuestion);
      setQuestion(newQuestion);
      setFeedback("");
    });

    socket.on("wrong-answer", ({ correctAnswer }) => {
      setFeedback(`Wrong! The correct answer is ${correctAnswer}.`);
      console.log(2);
    });

    return () => {
      socket.off("next-question");
      socket.off("wrong-answer");
    };
  }, []);

  const joinGame = () => {
    if (playerName) {
      console.log(3);
      socket.emit("player-join", playerName);
      setJoined(true);
    }
  };

  const submitAnswer = () => {
    if (answer) {
      socket.emit("answer-submitted", { playerName, answer });
      console.log(4);
    }
  };

  return (
    <div className="player-question-card">
      {!joined ? (
        <div>
          <h1>Enter your name to join</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <br />
          <button onClick={joinGame}>Join Game</button>
        </div>
      ) : (
        <div>
          {question ? (
            <>
              <h2>{question.question}</h2>
              {console.log(question.options)}
              <ul>
                {Object.keys(question.options).map((key) => (
                  <li key={key} onClick={() => setAnswer(key)}>
                    {question.options[key]}
                  </li>
                ))}
              </ul>
              <br />
              <button onClick={submitAnswer}>Submit Answer</button>
              {feedback && <p>{feedback}</p>}
            </>
          ) : (
            <h2>Waiting for question...</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default PlayerScreen;
