import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.get("/", auth(ENUM_USER_ROLE.ADMIN), UserController.getUsers);
router.get("/:email", auth(ENUM_USER_ROLE.USER), UserController.FindSingleUser);

router.post(
  "/create",
  validateRequest(UserValidation.createUserZodSchema),
  UserController.create
);

export const UserRoutes = router;
