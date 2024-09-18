import express from 'express'
import cors from 'cors'
const port = process.env.PORT || 3000

const app = express()

// Configurations
app.use(express.json())
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    optionsSuccessStatus: 200
}))


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})