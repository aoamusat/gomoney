import { Request, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { signUpSchema } from "../validations/signup";
import { loginSchema } from "../validations/login";
import Team from "../models/team";
import Fixture from "../models/fixture";
import mongoose, { CastError } from "mongoose";

config();

export const signUp = async (request: Request, response: Response) => {
  try {
    const { error } = signUpSchema.validate(request.body, { abortEarly: true });

    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const { email, password } = request.body;
    const userExists = await User.exists({ username: email });
    if (userExists) {
      return response.status(422).json({ message: "User already exists" });
    }
    const user = new User();
    user.username = email;
    user.role = "user";
    user.password = await bcrypt.hash(password, 8);

    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY || "secret");
    response.status(201).send({ user, token });
  } catch (e) {
    response.status(400).send(e);
  }
};

export const login = async (request: Request, response: Response) => {
  try {
    const { error } = loginSchema.validate(request.body, { abortEarly: true });

    if (error) {
      return response.status(400).json({ message: error.message });
    }
    const { email, password } = request.body;
    const user = await User.findOne({ username: email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(400).send({ error: "Invalid login credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY || "", { expiresIn: "2 days" });
    response.status(200).json({ token, user: { email: user.username, role: user.role } });
  } catch (e) {
    response.status(500).send(e);
  }
};

export const getTeams = async (request: Request, response: Response) => {
  try {
    const allTeams = await Team.find({}, { _id: false, __v: false });
    return response.status(200).json({ teams: allTeams });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFixtures = async (request: Request, response: Response) => {
  try {
    const { status } = request.query;
    let fixtures;
    if (status) {
      fixtures = await Fixture.find({ status: status }, { _id: false, __v: false });
    } else {
      fixtures = await Fixture.find({}, { _id: false, __v: false });
    }

    return response.json({ fixtures });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const search = async (request: Request, response: Response) => {
  try {
    const { query } = request.query;
    const searchRegex = new RegExp(query as string, "i");

    // Search for fixtures
    const fixtures = await Fixture.find(
      {
        $or: [{ homeTeam: searchRegex }, { awayTeam: searchRegex }],
      },
      { _id: false, __v: false },
    )
      .populate("homeTeam", "name")
      .populate("awayTeam", "name");

    response.status(200).json({ fixtures });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal server error" });
  }
};

export const showFixture = async (request: Request, response: Response) => {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(400).json({ error: "Invalid fixture ID" });
    }
    const fixture = await Fixture.findOne({ _id: request.params.id }, { _id: false, __v: false });
    if (fixture) {
      return response.json({ fixture });
    }
    return response.json({ message: "Fixture not found!" });
  } catch (error: any) {
    console.log(error);
    response.status(500).json({ error: "Internal server error" });
  }
};
