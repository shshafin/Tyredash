import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { Uservalidation } from "./user.validation";

const router = express.Router();

router.get("/", UserController.getUsers);
router.get("/:id", UserController.FindSingleUser);

router.post(
  "/create",
  validateRequest(Uservalidation.createStudent),
  UserController.create
);

export const UserRoutes = router;
