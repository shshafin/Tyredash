import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { IUser } from "./user.interface";
import httpStatus from "http-status";
import { UserFilterableFields } from "./user.constants";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";

const create: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const data = req.body;
    const result = await UserService.create(data);

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "created User successfully!",
      data: result,
    });
  }
);

// get all users
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, UserFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getUsers(filters, paginationOptions);
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get All user successfully",
    data: result.data,
    meta: result.meta,
  });
});

// find single user
const FindSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserService.getSingleUser(id);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get Single User successfully",
    data: result,
  });
});

export const UserController = {
  create,
  getUsers,
  FindSingleUser,
};
