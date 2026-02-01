import express from 'express'
const router = express.Router()

// GET → mostrar formulário
router.get('/', (req, res) => {
  res.render('signup', { title: 'Sign Up' })
})

// POST → receber dados do registro
router.post('/', (req, res) => {
  const { username, email, password } = req.body
  console.log('Novo usuário:', username, email, password)
  // aqui depois adiciona MongoDB + hash de senha
  res.send('Registro recebido! (ver console)')
})

export default router