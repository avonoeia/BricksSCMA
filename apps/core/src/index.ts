import express from 'express'
import cors from 'cors'
const port = process.env.PORT
import { router as authRoutes } from './routes/authRoutes'
// const authRoutes = require('./routes/authRoutes')

const app = express()

// Configurations
app.use(express.json())
app.use(cors({
    origin: `${process.env.CORS_ORIGIN}`,
    optionsSuccessStatus: 200
}))

// Routes
app.use('/auth', authRoutes)



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})