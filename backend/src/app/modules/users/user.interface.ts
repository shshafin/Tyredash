import { Model, Types } from "mongoose";

export type IUser = {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
};

export type UserModel = {
  isUserExist(
    email: string
  ): Promise<
    Pick<IUser, "email" | "password" | "role" | "needsPasswordChange">
  >;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
  searchTerm?: string;
};
