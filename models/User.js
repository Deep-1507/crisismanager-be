import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contacts: { type: [contactSchema], required: true, maxLength: 3 },
  distress:{type:Number,maxLength:1}
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);