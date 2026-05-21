import express from 'express'
import { chatbot } from '../controllers/chatbotController.js'

const chatbotRouter = express.Router()

chatbotRouter.post('/', chatbot)

export default chatbotRouter

