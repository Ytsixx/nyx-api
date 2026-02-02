import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  // 🔐 Auth
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  // 🧑 Perfil
  avatar: {
    type: String,
    default: '/images/default-avatar.png'
  },

  bio: {
    type: String,
    maxLength: 160,
    default: ''
  },

  // 🔗 Links
  links: {
    github: { type: String, default: '' },
    website: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    other: { type: String, default: '' }
  },

  // 🤝 Social
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],

  // ✅ NOVOS CAMPOS
  isVerified: {
    type: Boolean,
    default: false
  },

  isSuperAdmin: {
    type: Boolean,
    default: false
  },

  // ⚙️ Controle
  isBanned: {
    type: Boolean,
    default: false
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('User', userSchema)