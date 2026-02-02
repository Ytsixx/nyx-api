import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch(err => console.error('🔴 Erro MongoDB:', err))

import signupRoutes from './routes/signup.js'
import signinRoutes from './routes/signin.js'

const app = express()

// Middleware para ler dados do formulário
app.use(express.urlencoded({ extended: true }))

// Configura EJS
app.set('view engine', 'ejs')
app.set('views', './views')

// Servir arquivos estáticos (CSS, JS)
app.use(express.static('public'))

// Rotas
app.get('/', (req, res) => {
  res.render('index', { title: 'NYX-API', message: 'Bem-vindo à NYX-API!' })
})

app.use('/signup', signupRoutes)
app.use('/signin', signinRoutes)

// Porta
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 NYX-API rodando na porta ${PORT}`)
})