import { Request, Response } from "express";
import User from "../models/user";

export const toggleSavedProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.savedProducts.indexOf(productId);
    if (productIndex === -1) {
      user.savedProducts.push(productId);
    } else {
      user.savedProducts.splice(productIndex, 1);
    }
    await user.save();

    res.status(200).json({
      message: "Saved products updated",
      savedProducts: user.savedProducts
    });
  } catch (error) {
    console.error("Error toggling saved product:", error);
    res.status(500).json({ message: "Server error" });
  }
};