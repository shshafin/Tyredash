import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { YearController } from "./year.controller";
import { YearValidation } from "./year.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(YearValidation.createYearZodSchema),
  YearController.createYear
);

router.get("/:id", YearController.getSingleYear);

router.get("/", YearController.getAllYears);

router.patch(
  "/:id",
  validateRequest(YearValidation.updateYearZodSchema),
  YearController.updateYear
);

router.delete("/:id", YearController.deleteYear);

export const YearRoutes = router;
