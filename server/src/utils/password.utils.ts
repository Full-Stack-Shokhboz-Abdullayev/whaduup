import { genSalt, compare, hash } from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await compare(password, hash);
};
