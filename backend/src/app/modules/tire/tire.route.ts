import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TireController } from "./tire.controller";
import { TireValidation } from "./tire.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TireValidation.createTireZodSchema),
  TireController.createTire
);

router.get("/", TireController.getAllTires);
router.get("/:id", TireController.getSingleTire);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(TireValidation.updateTireZodSchema),
  TireController.updateTire
);

router.delete("/:id", auth(ENUM_USER_ROLE.ADMIN), TireController.deleteTire);

export const TireRoutes = router;
