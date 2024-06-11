import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { signUpSchema } from "../validations/signup";
import { loginSchema } from "../validations/login";
import Team from "../models/team";
import Fixture from "../models/fixture";
import { fixtureSchema } from "../validations/fixture";
import { generateFixtureLink } from "../utils/helpers";

config();

export const createTeam = async (request: Request, response: Response) => {
  try {
    const { name } = request.body;

    if (!name) {
      return response.status(400).json({ message: "Team name is required" });
    }

    const team = new Team();
    team.name = name;

    await team.save();
    response.status(201).send({ team });
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const createFixture = async (request: Request, response: Response) => {
  try {
    const { error } = fixtureSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ message: error.message });
    }

    const { awayTeam, homeTeam, date, status } = request.body;

    const fixture = new Fixture();
    fixture.awayTeam = awayTeam;
    fixture.homeTeam = homeTeam;
    fixture.date = date;
    fixture.status = status;
    fixture.link = generateFixtureLink(`${fixture._id}`);

    await fixture.save();
    return response.status(201).send({ fixture });
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateFixture = async (request: Request, response: Response) => {
  try {
    const { error } = fixtureSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ message: error.message });
    }

    const { awayTeam, homeTeam, date, status, score } = request.body;

    const fixture = await Fixture.findOneAndUpdate(
      { _id: request.params.id },
      {
        awayTeam: awayTeam,
        homeTeam: homeTeam,
        date: date,
        status: status,
        score: score,
      },
    );

    return response.status(200).send({ fixture });
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteFixture = async (request: Request, response: Response) => {
  try {
    const fixture = await Fixture.deleteOne({ _id: request.params.id });

    return response.status(200).send({ fixture });
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (request: Request, response: Response) => {
  try {
    const { error } = loginSchema.validate(request.body, { abortEarly: true });

    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const { email, password } = request.body;
    const user = await User.findOne({ username: email, role: "admin" });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(400).send({ error: "Invalid login credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY || "secret", { expiresIn: "2 days" });
    response.status(200).json({ token, user: { email: user.username, role: user.role } });
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const signUp = async (request: Request, response: Response) => {
  try {
    const { error } = signUpSchema.validate(request.body, { abortEarly: true });

    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const { email, password } = request.body;
    const user = new User();
    user.username = email;
    user.role = "admin";
    user.password = await bcrypt.hash(password, 8);

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY || "secret");
    response.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};
