import joi from 'joi';
import JoiPasswordComplexity from 'joi-password-complexity';

export const registerValidation = ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const schema = joi.object({
    username: joi.string().alphanum().min(3).max(30).required(),

    password: JoiPasswordComplexity({
      min: 6,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
    }),

    email: joi.string().email(),
  });

  return schema.validate({ username, email, password }, { abortEarly: false });
};
