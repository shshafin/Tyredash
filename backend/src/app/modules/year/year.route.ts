import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { YearController } from "./year.controller";
import { YearValidation } from "./year.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(YearValidation.createYearZodSchema),
  YearController.createYear
);

router.get("/:id", YearController.getSingleYear);

router.get("/", YearController.getAllYears);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(YearValidation.updateYearZodSchema),
  YearController.updateYear
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  YearController.deleteYear
);

export const YearRoutes = router;
