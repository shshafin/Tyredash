import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import { ProductController } from "./product.controller";
import { ProductValidation } from "./product.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(ProductValidation.createProductZodSchema),
  ProductController.createProduct
);

router.get("/:id", ProductController.getSingleProduct);

router.get("/", ProductController.getAllProducts);

router.patch(
  "/:id",
  validateRequest(ProductValidation.updateProductZodSchema),
  ProductController.updateProduct
);

router.delete("/:id", ProductController.deleteProduct);

export const ProductRoutes = router;
