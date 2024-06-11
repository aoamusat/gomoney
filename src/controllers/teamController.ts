import { Request, Response } from "express";
import Team from "../models/team";

export const addTeam = async (req: Request, res: Response) => {
  try {
    const team = new Team(req.body);
    await team.save();
    res.status(201).send(team);
  } catch (e) {
    res.status(400).send(e);
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find();
    res.send(teams);
  } catch (e) {
    res.status(500).send(e);
  }
};
