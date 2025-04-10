import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TireSizeValidation } from "./tire-size-validation";
import { TireSizeController } from "./tire-size.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(TireSizeValidation.createTireSizeZodSchema),
  TireSizeController.createTireSize
);

router.get("/:id", TireSizeController.deleteTireSize);

router.get("/", TireSizeController.getAllTireSizes);

router.patch(
  "/:id",
  validateRequest(TireSizeValidation.updateTireSizeZodSchema),
  TireSizeController.updateTireSize
);

router.delete("/:id", TireSizeController.deleteTireSize);

export const TireSizeRoutes = router;
