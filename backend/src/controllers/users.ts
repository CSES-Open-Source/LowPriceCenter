import { Request, Response } from "express";
import UserModel from "src/models/user";
import mongoose = require("mongoose");

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const product = await UserModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
  }
};

export const addUser = async (req: Request, res: Response) => {};

export const deleteUserById = async (req: Request, res: Response) => {};

export const updateUserById = async (req: Request, res: Response) => {};
