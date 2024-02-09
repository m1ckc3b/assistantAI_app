import MessageBox from "./components/MessageBox.js";

async function sendMessage() {
  const userInput = document.querySelector("#textarea").value;
  if (!userInput) return;

  appendMessage('user', userInput)

  // Reset input
  document.querySelector("#textarea").value = ""

  try {
    const response = await fetch("http://localhost:3000/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    const botResponse = data.message;
    appendMessage("bot", botResponse);
  } catch (error) {
    console.error("Error:", error);
    appendMessage("bot", "Une erreur est survenue. Veuillez réessayer.");
  }
}

function appendMessage(sender, message) {
  const chatBox = document.querySelector(".wrapper-messages")
  const msg = new MessageBox(message)
  msg.classList.add(sender === 'user' ? "user-message" : 'bot-message')
    chatBox.append(msg)
}

document.querySelector('#send').addEventListener('click', sendMessage)