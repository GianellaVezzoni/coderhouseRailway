import bcrypt from "bcrypt";

export const encryptPassword = (password) => {
  const passwordEncrypted = bcrypt.hashSync(password, 10);
  return passwordEncrypted;
};

export const comparePasswords = async (passwordLogin, passwordFromMongo) => {
  const passwordEncrypted = bcrypt.hashSync(passwordLogin, 10);
  const passwordCompared = await bcrypt.compare(passwordEncrypted, passwordFromMongo);
  return passwordCompared;
};
