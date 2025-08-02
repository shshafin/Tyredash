import express from "express";
import auth from "../../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../../enum/user";
import validateRequest from "../../../middlewares/validateRequest";
import { FleetNewsValidation } from "./news.validation";
import { FleetNewsController } from "./news.controller";

const router = express.Router();

router.post(
  "/create",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetNewsValidation.createFleetNewsZodSchema),
  FleetNewsController.createFleetNews
);

router.get("/", FleetNewsController.getAllFleetNews);
router.get("/:id", FleetNewsController.getSingleFleetNews);

router.patch(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FleetNewsValidation.updateFleetNewsZodSchema),
  FleetNewsController.updateFleetNews
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FleetNewsController.deleteFleetNews
);

// Additional Routes
router.get("/featured/news", FleetNewsController.getFeaturedNews);
router.get("/recent/news", FleetNewsController.getRecentNews);

export const FleetNewsRoutes = router;
