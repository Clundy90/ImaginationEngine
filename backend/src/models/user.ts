/* backend/models/user.ts */
import mongoose, { Schema, Document } from "mongoose";

// Define the shape of a User document
export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
export default mongoose.model<IUser>("User", UserSchema);
