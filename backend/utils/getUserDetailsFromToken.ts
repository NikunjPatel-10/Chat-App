import jwt from 'jsonwebtoken';
import { UserModel } from '../models/UserModel';

export const getUserDetailsFromToken = async (token:any) => {

  try {
    // Decode the token to extract user data
    const decoded:any = jwt.verify(token, '54bdc0ec556bfef0faa84c1675c4abbfb01db5cf1b77b6805c61844e463282fe');

    // Find the user by ID and exclude the password field
    const userData = await UserModel.findById(decoded._id).select('-password');    

    // Return the user data
    return userData;
  } catch (error) {
    // Handle any errors that may occur during token verification or database query
    console.error('Error decoding token or fetching user details:', error);
    throw new Error('Invalid token or user not found');
  }
};


     