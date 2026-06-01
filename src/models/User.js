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
    password: { // Changed from passwordHash to match your API request
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
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving to the database
userSchema.pre('save', async function () {
  // Only run this function if the password field was actually modified
  if (!this.isModified('password')) return;

  // Generate salt and hash the password (no next() needed for async hooks)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
// Instance method to check if a password matches the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;