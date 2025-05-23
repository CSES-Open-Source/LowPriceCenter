import { Request, Response } from "express";
import UserModel from "src/models/user";
import { getAuth } from "firebase-admin/auth";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// id: firebase user id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.params.firebaseUid;

    const user = await UserModel.findOne({ firebaseUid: firebaseUid });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error getting user", error });
  }
};

// id: firebase user id
export const addUser = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.body;
    const firebaseUser = await getAuth().getUser(firebaseUid);

    const userEmail = firebaseUser.email;
    const displayName = firebaseUser.displayName || "";

    // Restrict to UCSD emails only
    if (!userEmail || !userEmail.endsWith("@ucsd.edu")) {
      return res.status(403).json({ message: "Only UCSD emails are allowed." });
    }

    // Check for an existing user in MongoDB
    const existingUser = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (existingUser) {
      res.status(409).json({ message: "User already exists", user: existingUser });
      return;
    }

    // Add user to MongoDB
    const newUser = new UserModel({
      userEmail,
      displayName,
      activeUser: true,
      lastLogin: new Date(),
      productList: [],
      firebaseUid,
    });

    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};

// id: firebase user id
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.params.firebaseUid;
    const user = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (!user) {
      throw new Error("User not found");
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

// id: firebase user id
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const { displayName, deactivateAccount } = req.body;
    const firebaseUid = req.params.firebaseUid;
    const updatedUser = await UserModel.findOne({ firebaseUid: firebaseUid });
    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Update fields if provided
    if (displayName != undefined) {
      updatedUser.displayName = displayName;
    }

    if (deactivateAccount != undefined) {
      updatedUser.activeUser = false;
    }

    // Update Firebase user
    const firebaseUser = await getAuth().getUserByEmail(updatedUser.userEmail);
    if (firebaseUser) {
      await getAuth().updateUser(firebaseUser.uid, { disabled: true });
    }

    await updatedUser.save();

    res.status(200).json({
      message: "User successfully updated",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staffUsers = await UserModel.find({ role: { $in: ["staff", "admin"] } });
    res.status(200).json(staffUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff users", error });
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customerUsers = await UserModel.find({ role: "user" });
    res.status(200).json(customerUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer users", error });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;
    const { role } = req.body;

    if (!["user", "staff", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Find and update user in MongoDB
    const user = await UserModel.findOneAndUpdate(
      { firebaseUid },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      await getAuth().setCustomUserClaims(firebaseUid, { role });
    } catch (firebaseError) {
      console.error("Failed to update Firebase claims:", firebaseError);
    }

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error changing user role", error });
  }
};