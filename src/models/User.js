import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    role: {
      type: String,
      enum: {
        values: ['Brand', 'Creator', 'Admin'],
        message: 'Role must be either Brand, Creator, or Admin',
      },
      default: 'Creator',
    },
    profileDetails: {
      location: {
        type: String,
        default: '',
      },
      niche: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save hook to hash password before saving to the database
userSchema.pre('save', async function (next) {
  // Only run this function if the passwordHash field was actually modified
  if (!this.isModified('passwordHash')) return next();

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check if a password matches the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

export default User;
