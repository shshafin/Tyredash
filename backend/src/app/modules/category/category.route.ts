import express from "express";

import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory
);

router.get("/:id", CategoryController.getSingleCategory);

router.get("/", CategoryController.getAllCategories);

router.patch(
  "/:id",
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory
);

router.delete("/:id", CategoryController.deleteCategory);

export const CategoryRoutes = router;
