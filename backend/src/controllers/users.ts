import { Request, Response } from "express";
import UserModel from "src/models/user";
import mongoose = require("mongoose");
import { getAuth } from "firebase-admin/auth";

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

export const addUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Missing required idToken" });
    }

    // Verify ID token and get Firebase user info
    const decodedToken = await getAuth().verifyIdToken(id);
    const firebaseUser = await getAuth().getUser(decodedToken.uid);

    const userEmail = firebaseUser.email;
    const displayName = firebaseUser.displayName || "";

    // Add user to MongoDB
    const newUser = new UserModel({
      userEmail,
      displayName,
      activeUser: true,
      lastLogin: new Date(),
      productList: [],
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle activeUser status
    user.activeUser = false;

    await user.save();

    // Update Firebase user
    const firebaseUser = await getAuth().getUserByEmail(user.userEmail);
    if (firebaseUser) {
      await getAuth().updateUser(firebaseUser.uid, { disabled: !user.activeUser });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const updateUserById = async (req: Request, res: Response) => {};
