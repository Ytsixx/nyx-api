import express from 'express'
const router = express.Router()

// GET → mostrar formulário
router.get('/', (req, res) => {
  res.render('signin', { title: 'Sign In' })
})

// POST → receber dados do login
router.post('/', (req, res) => {
  const { username, password } = req.body
  console.log('Login attempt:', username, password)
  // aqui depois adiciona validação com MongoDB
  res.send('Login recebido! (ver console)')
})

export default router