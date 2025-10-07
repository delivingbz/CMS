import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userNumber: { type: String, required: true },
    userPassword: { type: String, required: true },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
