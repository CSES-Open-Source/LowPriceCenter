import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import validationErrorParser from "../util/validationErrorParser";
import ProductModel from "../models/product";
import UserModel from "../models/user";
dotenv.config();
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
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
  const { consumerId, productId } = req.body as ContactRequest;

  console.log("Contact request received:", { consumerId, productId });
  const product = await ProductModel.findById(productId);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  const productName = product.name;
  const sellerEmail = product?.userEmail;
  const consumer = await UserModel.findById(consumerId);

  if (!consumer) {
    res.status(404).json({ message: "Consumer not found" });
    return;
  }
  const consumerName = consumer.displayName;
  const consumerEmail = consumer.userEmail;

  const EMAIL_SUBJECT = `${consumerName} is interested in one of your products on Low-Price Center`;
  const EMAIL_BODY = `${consumerName} is interested in your listing of ${productName}. \nPlease reach out to ${consumerName} for more details!\nTheir email is ${consumerEmail}`;

  try {
    validationErrorParser(errors);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      secure: true,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: sellerEmail,
      subject: EMAIL_SUBJECT,
      text: EMAIL_BODY,
    };
    await transporter.sendMail(mailOptions);
    console.log("Interest email sent successfully");
    res.status(200).json({ message: "Interest email submitted successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    next(error);
  }
};
