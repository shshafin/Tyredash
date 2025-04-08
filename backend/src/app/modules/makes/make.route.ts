import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { MakeController } from "./make.controller";
import { MakeValidation } from "./make.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(MakeValidation.createMakeZodSchema),
  MakeController.createMake
);

router.get("/:id", MakeController.getSingleMake);

router.get("/", MakeController.getAllMakes);

router.patch(
  "/:id",
  validateRequest(MakeValidation.updateMakeZodSchema),
  MakeController.updateMake
);

router.delete("/:id", MakeController.deleteMake);

export const MakeRoutes = router;
