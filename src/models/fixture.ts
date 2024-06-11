import { Schema, model, Document } from "mongoose";

interface FixtureInterface extends Document {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  score?: string;
  status: "pending" | "completed";
  link: string;
}

const fixtureSchema = new Schema<FixtureInterface>({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  date: { type: Date, required: true },
  score: { type: String },
  status: { type: String, enum: ["pending", "completed"], required: true },
  link: { type: String, required: true, unique: true },
});

const Fixture = model<FixtureInterface>("Fixture", fixtureSchema);
export default Fixture;
