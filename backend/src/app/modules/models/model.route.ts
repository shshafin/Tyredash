import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ModelController } from "./model.controller";
import { ModelValidation } from "./model.validation";

const router = express.Router();

router.post(
  "/create-model",
  validateRequest(ModelValidation.createModelZodSchema),
  ModelController.createModel
);

router.get("/:id", ModelController.getSingleModel);

router.get("/", ModelController.getAllModels);

router.patch(
  "/:id",
  validateRequest(ModelValidation.updateModelZodSchema),
  ModelController.updateModel
);

router.delete("/:id", ModelController.deleteModel);

export const ModelRoutes = router;
