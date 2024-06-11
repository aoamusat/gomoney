import { Schema, model, Document } from "mongoose";

interface TeamInterface extends Document {
  name: string;
}

const teamSchema = new Schema<TeamInterface>({
  name: { type: String, required: true, unique: true },
});

const Team = model<TeamInterface>("Team", teamSchema);
export default Team;
