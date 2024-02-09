import express from "express"
import OpenAI from "openai"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors())

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Endpoints
app.post('/message', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Create a thread
    const emptyThread = await openaiClient.beta.threads.create()
    const threadId = emptyThread.id

    // Add message to the thread
    await openaiClient.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage
    })

    // Runs Assistant
    let run = await openaiClient.beta.threads.runs.create(
      threadId, 
      { assistant_id: process.env.ASSISTANT_ID }
    )

    // Check the run status
    while(run.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      run = await openaiClient.beta.threads.runs.retrieve(threadId, run.id)
    }

    const runMessage = await openaiClient.beta.threads.messages.list(threadId)

    res.json({ message: runMessage.data[0].content[0].text.value })
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Une erreur est survenue lors du traitement de la demande.' });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Le serveur écoute sur http://localhost:${port}`);
});