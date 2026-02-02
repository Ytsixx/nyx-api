import express from 'express'
import User from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import transporter from '../config/mailer.js'

const router = express.Router()

// === SIGN UP + envio de email de verificação ===
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 1️⃣ Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // 2️⃣ Cria usuário
    const user = await User.create({ username, email, password: hashedPassword })

    // 3️⃣ Gera token JWT de verificação
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })

    // 4️⃣ Cria link de verificação
    const verifyLink = `${process.env.FRONTEND_URL}/verify?token=${token}`

    // 5️⃣ Envia email
    await transporter.sendMail({
      from: `"NYX-API" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verifique seu email',
      html: `<p>Olá ${user.username},</p>
             <p>Clique no link para ativar sua conta:</p>
             <a href="${verifyLink}">${verifyLink}</a>`
    })

    res.send('Usuário criado! Verifique seu email para ativar a conta.')
  } catch (err) {
    console.log(err)
    res.status(500).send('Erro no cadastro')
  }
})

// === VERIFICAÇÃO DO USUÁRIO ===
router.get('/verify', async (req, res) => {
  const { token } = req.query
  if (!token) return res.status(400).send('Token inválido')

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) return res.status(404).send('Usuário não encontrado')

    user.isVerified = true
    await user.save()

    res.send('Conta verificada com sucesso! Pode logar agora.')
  } catch (err) {
    console.log(err)
    res.status(400).send('Token expirado ou inválido')
  }
})

// === RECUPERAÇÃO DE SENHA - envio de email ===
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(404).send('Email não encontrado')

  // Gera token temporário
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `"NYX-API" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Recuperação de senha',
    html: `<p>Olá ${user.username},</p>
           <p>Clique no link para resetar sua senha (válido por 1h):</p>
           <a href="${resetLink}">${resetLink}</a>`
  })

  res.send('Email de recuperação enviado!')
})

// === RESET DE SENHA - atualizar no DB ===
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body
  if (!token) return res.status(400).send('Token inválido')

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) return res.status(404).send('Usuário não encontrado')

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.send('Senha atualizada com sucesso!')
  } catch (err) {
    console.log(err)
    res.status(400).send('Token expirado ou inválido')
  }
})

export default router