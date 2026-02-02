import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js' // ajusta o path certo

const router = express.Router()

// GET → mostrar formulário
router.get('/', (req, res) => {
  res.render('signup', { title: 'Sign Up' })
})

// POST → registro real
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // validação básica
    if (!username || !email || !password) {
      return res.status(400).send('Preenche todos os campos')
    }

    // verificar se já existe username ou email
    const userExists = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    })

    if (userExists) {
      return res.status(409).send('Usuário ou email já existe')
    }

    // hash da senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // criar usuário
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword
    })

    await newUser.save()

    // resposta
    res.status(201).send('Usuário criado com sucesso')
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro no servidor')
  }
})

export default router