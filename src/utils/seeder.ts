import Fixture from "../models/fixture";
import Team from "../models/team";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { config } from "dotenv";
import { generateFixtureLink } from "./helpers";
config();

const seed = async () => {
  // Connect to the DB
  mongoose.connect(process.env.MONGODB_URI || "");
  // Clear existing data
  await User.deleteMany({});
  await Team.deleteMany({});
  await Fixture.deleteMany({});

  const seedPromise = [];
  const passwordHash = await bcrypt.hash("password", 10);

  seedPromise.push(
    new User({
      username: "admin@gomoney.io",
      password: passwordHash,
      role: "admin",
    }).save(),
  );

  for (let index = 0; index < 5; index++) {
    // Seed 5 user account
    seedPromise.push(
      new User({
        username: faker.internet.email(),
        password: passwordHash,
        role: "user",
      }).save(),
    );
  }

  for (let index = 0; index < 5; index++) {
    // Seed 10 team account
    seedPromise.push(
      new Team({
        name: faker.lorem.word().toUpperCase(),
      }).save(),
    );
  }

  for (let index = 0; index < 20; index++) {
    // Seed 20 fixtures account
    const f = new Fixture({
      homeTeam: faker.lorem.word().toUpperCase(),
      awayTeam: faker.lorem.word().toUpperCase(),
      date: new Date(Date.now()).toISOString(),
      status: ["pending", "completed"][Math.floor(Math.random() * 2)],
    });
    f.link = generateFixtureLink(`${f._id}`);
    seedPromise.push(f.save());
  }

  await Promise.all(seedPromise);
};

seed()
  .then(() => {
    console.log("Database seeding completed...");
    process.exit(0);
  })
  .catch((error) => {
    console.log({ SEED_ERROR: error });
    console.log("Database seeding failed. See logs for details");
    process.exit(1);
  });
