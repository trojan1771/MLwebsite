import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import { register } from './controllers/auth.js'
import { verifyToken } from './middleware/auth.js'
import authRoutes from './routes/auth.js'

import path from 'path'
import { fileURLToPath } from 'url'

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))
mongoose.set('strictQuery', true)
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage })

/* ROUTES WITH FILES */
app.post(
  '/auth/register',

  upload.single('picture'),
  register
)

/* ROUTES */
app.use('/auth', authRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
  })
  .catch((error) => console.log(`${error} did not connect`))
