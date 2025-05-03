import { CartItem, ICart, ProductType } from "./cart.interface";
import { Cart } from "./cart.model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { Tire } from "../tire/tire.model";
import { Wheel } from "../wheel/wheel.model";
import { Product } from "../product/product.model";
import { SortOrder, Types } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { cartFilterableFields } from "./cart.constants";

const getProductDetails = async (
  productId: string,
  productType: ProductType,
  quantity: number
) => {
  let product;

  switch (productType) {
    case "tire":
      product = await Tire.findById(productId);
      break;
    case "wheel":
      product = await Wheel.findById(productId);
      break;
    case "product":
      product = await Product.findById(productId);
      break;
    default:
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product type");
  }

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Check stock availability
  if (product.stockQuantity < quantity) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Only ${product.stockQuantity} items available in stock`
    );
  }

  return {
    name: product.name,
    price: product.discountPrice || product.price,
    thumbnail: product.images?.[0] || "",
    stock: product.stockQuantity,
  };
};

const createCart = async (userId: Types.ObjectId): Promise<ICart> => {
  const existingCart = await Cart.findOne({ user: userId });
  if (existingCart) {
    return existingCart;
  }

  const newCart = await Cart.create({
    user: userId,
    items: [],
    totalPrice: 0,
    totalItems: 0,
  });

  return newCart;
};

const addItemToCart = async (
  userId: string,
  productId: string,
  productType: ProductType,
  quantity: number = 1
): Promise<ICart> => {
  // Validate input
  if (!Types.ObjectId.isValid(productId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid product ID");
  }

  if (quantity < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");
  }

  // Get product details with stock check
  const { name, price, thumbnail } = await getProductDetails(
    productId,
    productType,
    quantity
  );

  // Find or create cart
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalPrice: 0,
      totalItems: 0,
    });
  }

  // Check if product already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId && item.productType === productType
  );

  if (existingItemIndex !== -1) {
    // Update quantity if product exists
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item if product doesn't exist
    cart.items.push({
      product: new Types.ObjectId(productId),
      productType,
      quantity,
      price,
      name,
      thumbnail,
    });
  }

  await cart.save();
  return cart;
};

const removeItemFromCart = async (
  userId: string,
  productId: string,
  productType: ProductType
): Promise<ICart> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const initialItemCount = cart.items.length;
  cart.items = cart.items.filter(
    (item) =>
      item.product.toString() !== productId || item.productType !== productType
  );

  if (cart.items.length === initialItemCount) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  await cart.save();
  return cart;
};

const updateItemQuantity = async (
  userId: string,
  productId: string,
  productType: ProductType,
  quantity: number
): Promise<ICart> => {
  // Validate input
  if (quantity < 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Quantity must be at least 1");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.product.toString() === productId && item.productType === productType
  );

  if (itemIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }

  // Check stock availability before updating quantity
  const { stock } = await getProductDetails(productId, productType, quantity);

  if (stock < quantity) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Only ${stock} items available in stock`
    );
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return cart;
};

const getCartByUserId = async (userId: string): Promise<ICart> => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return await Cart.create({
      user: new Types.ObjectId(userId),
      items: [],
      totalPrice: 0,
      totalItems: 0,
    });
  }

  // Populate product details and check availability
  const populatedItems = await Promise.all(
    cart.items.map(async (item) => {
      try {
        const { stock } = await getProductDetails(
          item.product.toString(),
          item.productType,
          item.quantity
        );

        let productDetails;
        switch (item.productType) {
          case "tire":
            productDetails = await Tire.findById(item.product).lean();
            break;
          case "wheel":
            productDetails = await Wheel.findById(item.product).lean();
            break;
          case "product":
            productDetails = await Product.findById(item.product).lean();
            break;
        }

        return {
          product: item.product,
          productType: item.productType,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          thumbnail: item.thumbnail,
          productDetails,
          availableStock: stock,
          isAvailable: stock >= item.quantity,
        };
      } catch (error) {
        // If product is not found, mark it as unavailable
        return {
          product: item.product,
          productType: item.productType,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          thumbnail: item.thumbnail,
          productDetails: null,
          availableStock: 0,
          isAvailable: false,
        };
      }
    })
  );

  // Create a new object with the cart properties and populated items
  const result = {
    _id: cart._id,
    user: cart.user,
    items: populatedItems,
    totalPrice: cart.totalPrice,
    totalItems: cart.totalItems,
  };

  return result as ICart;
};

const clearCart = async (userId: string): Promise<ICart> => {
  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalPrice: 0, totalItems: 0 },
    { new: true }
  );

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cart not found");
  }

  return cart;
};

const getAllCarts = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<ICart[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: cartFilterableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Cart.find(whereConditions)
    .populate("user")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cart.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const CartService = {
  createCart,
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  getAllCarts,
  clearCart,
};
