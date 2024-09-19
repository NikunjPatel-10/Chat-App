import { UserModel } from "../models/UserModel";
import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  console.log(userId);
  
  const employee = await UserModel.findById(userId).select("-password");
  res.status(200).json({
    status: "success",
    data: employee,
  });
};
