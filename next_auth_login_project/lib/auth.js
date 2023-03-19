import { hash, compare } from "bcryptjs";

export const hashPassword = async (password) => {
  const hahedPassword = await hash(password, 12);
  return hahedPassword;
};

export async function verifyPassword(password, hahedPassword) {
  const isValid = await compare(password, hahedPassword);
  return isValid;
}
