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
import { TireRoutes } from "../modules/tire/tire.route";
import { WheelRoutes } from "../modules/wheel/wheel.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { WishlistRoutes } from "../modules/wishlist/wishlist.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { UploadRoutes } from "../modules/upload-images/upload.route";
import { OrderRoutes } from "../modules/order/order.route";
import { TireWidthRoutes } from "../modules/tire-width/tire-width.route";
import { TireDiameterRoutes } from "../modules/tire-diameter/tire-diameter.route";
import { TireRatioRoutes } from "../modules/tire-ratio/tire-ratio.route";
import { VehicleTypeRoutes } from "../modules/vehicle-type/vehicle-type.route";
import { WheelWidthRoutes } from "../modules/wheel-width/wheel-width.route";
import { WheelRatioRoutes } from "../modules/wheel-ratio/wheel-ratio.route";
import { WheelDiameterRoutes } from "../modules/wheel-diameter/wheel-diameter.route";
import { TireWidthTypeRoutes } from "../modules/wheel-width-type/wheel-width-type.route";
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
    path: "/models",
    module: ModelRoutes,
  },
  {
    path: "/trims",
    module: TrimRoutes,
  },
  {
    path: "/tiresizes",
    module: TireSizeRoutes,
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
    path: "/driving-type",
    module: DrivingTypeRoutes,
  },
  {
    path: "/tire",
    module: TireRoutes,
  },
  {
    path: "/tire-width",
    module: TireWidthRoutes,
  },
  {
    path: "/tire-ratio",
    module: TireRatioRoutes,
  },
  {
    path: "/tire-diameter",
    module: TireDiameterRoutes,
  },
  {
    path: "/vehicle-type",
    module: VehicleTypeRoutes,
  },
  {
    path: "/wheel",
    module: WheelRoutes,
  },
  {
    path: "/wheel-width",
    module: WheelWidthRoutes,
  },
  {
    path: "/wheel-ratio",
    module: WheelRatioRoutes,
  },
  {
    path: "/wheel-diameter",
    module: WheelDiameterRoutes,
  },
  {
    path: "/wheel-width-type",
    module: TireWidthTypeRoutes,
  },
  {
    path: "/brand",
    module: BrandRoutes,
  },
  {
    path: "/cart",
    module: CartRoutes,
  },
  {
    path: "/reviews",
    module: ReviewRoutes,
  },
  {
    path: "/wishlists",
    module: WishlistRoutes,
  },
  {
    path: "/payment",
    module: PaymentRoutes,
  },
  {
    path: "/order",
    module: OrderRoutes,
  },
  {
    path: "/upload",
    module: UploadRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.module));
export default router;
