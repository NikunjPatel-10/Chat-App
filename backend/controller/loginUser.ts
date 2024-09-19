import { UserModel } from "../models/UserModel";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt.helpers";

const loginUser = async (request:any, response:any, next:any) => {
  try {
    const { email, password } = request.body;

    const user = await UserModel.findOne({ email });
    // console.log("User fetched from DB:", user);

    // Check if the user exists
    if (!user) {
      return response.status(401).json({ error: "Email is incorrect" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ error: "Password is incorrect" });
    }
    const tokens = jwtTokens(user);
    // console.log("Generated JWT Tokens:", tokens); // Log the generated tokens

    // Send the tokens as the response
    return response.json(tokens);
  } catch (err:any) {
    console.error("Error during login process", err.stack); // Log the error stack
    next(err); // Pass the error to the next middleware
  }
};

export default loginUser;
