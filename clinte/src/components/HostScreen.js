import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";

// Update the socket URL to your server's IP and port
const socket = io("http://192.168.0.5:4000"); // Change this IP as necessary

function HostScreen() {
  const [question, setQuestion] = useState(null);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate(); // Use useHistory hook for programmatic navigation

  useEffect(() => {
    // Socket event listeners
    socket.on("update-players", (players) => {
      setPlayers(players);
      if (players.length > 0) {
        navigate("/player"); // Redirect to the player page
      }
    });

    socket.on("correct-answer", ({ playerName }) => {
      setWinner(playerName);
    });

    socket.on("next-question", (nextQuestion) => {
      setQuestion(nextQuestion);
      setWinner(null); // Reset winner for the next question
    });

    // Cleanup on component unmount
    return () => {
      socket.off("update-players");
      socket.off("correct-answer");
      socket.off("next-question");
    };
  }, [navigate]);

  // Dynamically generate the QR code value based on the current hostname
  const qrCodeValue = `http://192.168.0.5:3000/player`;

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>KBC Game Host</h1>
      {question ? (
        <>
          <h2>Question: {question.question}</h2>
          <ul>
            {question.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          {winner && <h3>Congratulations {winner}!</h3>}
        </>
      ) : (
        <h2>Waiting for players...</h2>
      )}

      {/* Display the QR code for players to join */}
      <div style={{ margin: "20px 0" }}>
        <QRCodeCanvas value={qrCodeValue} />
        <p>Scan the QR code to join the game!</p>
      </div>

      <h3>Players:</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HostScreen;
