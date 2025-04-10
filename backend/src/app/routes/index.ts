import express from "express";

import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { YearRoutes } from "../modules/year/year.route";
import { MakeRoutes } from "../modules/makes/make.route";
import { ModelRoutes } from "../modules/models/model.route";
import { TrimRoutes } from "../modules/trims/trim.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/product/product.route";
import { TireSizeRoutes } from "../modules/tire-size/tire-size.route";
import { DrivingTypeRoutes } from "../modules/driving-type/driving-type.route";

const router = express.Router();

const modulesRoutes = [
  {
    path: "/users",
    module: UserRoutes,
  },
  {
    path: "/auth",
    module: AuthRoutes,
  },
  {
    path: "/years",
    module: YearRoutes,
  },
  {
    path: "/makes",
    module: MakeRoutes,
  },
  {
    path: "/makes",
    module: MakeRoutes,
  },
  {
    path: "/models",
    module: ModelRoutes,
  },
  {
    path: "/trims",
    module: TrimRoutes,
  },
  {
    path: "/categories",
    module: CategoryRoutes,
  },
  {
    path: "/categories",
    module: CategoryRoutes,
  },
  {
    path: "/products",
    module: ProductRoutes,
  },
  {
    path: "/tire-size",
    module: TireSizeRoutes,
  },
  {
    path: "/driving-type",
    module: DrivingTypeRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.module));
export default router;
