import jwt from 'jsonwebtoken';

// Generate an access token and a refresh token for this database user
function jwtTokens({ _id, name,email,profilePicture,password  }: any) {
  const user = { _id, name,email,profilePicture,password };
  console.log("User", user);
  
  
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1d' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '5d' });
  
  return { accessToken, refreshToken };
}

export { jwtTokens };
