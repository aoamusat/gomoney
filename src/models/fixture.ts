import { Schema, model, Document } from "mongoose";

interface FixtureInterface extends Document {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  score?: { homeScore: number; awayScore: number };
  status: "pending" | "completed";
  link: string;
}

const fixtureSchema = new Schema<FixtureInterface>({
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  date: { type: Date, required: true },
  score: {
    homeScore: { type: Number, required: true, default: 0 },
    awayScore: { type: Number, required: true, default: 0 },
  },
  status: { type: String, enum: ["pending", "completed"], required: true },
  link: { type: String, required: true, unique: true },
});

const Fixture = model<FixtureInterface>("Fixture", fixtureSchema);
export default Fixture;
