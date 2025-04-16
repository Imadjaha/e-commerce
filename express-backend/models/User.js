import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["user", "admin"];

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

export default mongoose.model("User", userSchema);
