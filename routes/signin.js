import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js' // ajusta o path

const router = express.Router()

// GET → mostrar formulário
router.get('/', (req, res) => {
  res.render('signin', { title: 'Sign In' })
})

// POST → login real
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).send('Preenche todos os campos')
    }

    // procurar usuário (username ou email)
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    })

    if (!user) {
      return res.status(401).send('Usuário ou senha inválidos')
    }

    // verificar se está banido
    if (user.isBanned) {
      return res.status(403).send('Conta banida')
    }

    // comparar senha
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).send('Usuário ou senha inválidos')
    }

    // gerar token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // resposta
    res.status(200).json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isSuperAdmin: user.isSuperAdmin
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro no servidor')
  }
})

export default router