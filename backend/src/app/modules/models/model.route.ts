import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ModelController } from "./model.controller";
import { ModelValidation } from "./model.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enum/user";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ModelValidation.createModelZodSchema),
  ModelController.createModel
);

router.get("/:id", ModelController.getSingleModel);

router.get("/", ModelController.getAllModels);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ModelValidation.updateModelZodSchema),
  ModelController.updateModel
);

router.delete("/:id", ModelController.deleteModel);

export const ModelRoutes = router;
