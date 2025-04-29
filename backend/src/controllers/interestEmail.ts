import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validationErrorParser from "../util/validationErrorParser";
import ProductModel from "../models/product";
import UserModel from "../models/user";
import InterestEmailModel from "../models/interestEmail"; // ← your rate-limit model

dotenv.config();

const EMAIL = process.env.EMAIL!;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD!;

export type ContactRequest = {
  consumerId: string;
  productId: string;
};

export const handleInterestEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const errors = validationResult(req);
  validationErrorParser(errors);

  const { consumerId, productId } = req.body as ContactRequest;
  console.log("Contact request received:", { consumerId, productId });

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const consumer = await UserModel.findOne({ firebaseUid: consumerId });
    if (!consumer) {
      res.status(404).json({ message: "Consumer not found" });
      return;
    }

    const now = new Date();
    const tenMinAgo = new Date(now.getTime() - 10 * 1000 * 60);
    const record = await InterestEmailModel.findOne({ consumerId, productId });

    if (record && record.lastSentAt > tenMinAgo) {
      res
        .status(429)
        .json({ message: "Please wait 10 minutes before sending another interest email." });
      return;
    }
    const subject = `${consumer.displayName} is interested in your product "${product.name}"`;
    const body = [
      `${consumer.displayName} is interested in your listing of ${product.name}.`,
      `Please reach out to them at ${consumer.userEmail}.`,
    ].join("\n\n");

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: { user: EMAIL, pass: EMAIL_PASSWORD },
    });
    await transporter.sendMail({
      from: EMAIL,
      to: product.userEmail,
      subject,
      text: body,
    });
    if (record) {
      record.lastSentAt = now;
      await record.save();
    } else {
      await InterestEmailModel.create({ consumerId, productId, lastSentAt: now });
    }

    console.log("Interest email sent successfully");
    res.status(200).json({ message: "Interest email submitted successfully." });
  } catch (err) {
    console.error("Error in handleInterestEmail:", err);
    next(err);
  }
};
