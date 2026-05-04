import { Response } from "express";
import ProductModel from "src/models/product";
import UserModel from "src/models/user";
import { AuthenticatedRequest } from "src/validators/authUserMiddleware";
import mongoose from "mongoose";
import { bucket } from "src/config/firebase"; // Import Firebase bucket
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // For unique filenames
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "src/config/firebaseConfig";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).array("images", 10);

const getSingleFormValue = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.find((entry): entry is string => typeof entry === "string");
  }
};

const parsePickupLocation = (body: Record<string, unknown>) => {
  const address = getSingleFormValue(body.pickupAddress)?.trim();
  const placeId = getSingleFormValue(body.pickupPlaceId)?.trim();
  const rawLat = getSingleFormValue(body.pickupLat);
  const rawLng = getSingleFormValue(body.pickupLng);
  const lat = rawLat === undefined ? Number.NaN : Number(rawLat);
  const lng = rawLng === undefined ? Number.NaN : Number(rawLng);

  if (!address || !placeId || Number.isNaN(lat) || Number.isNaN(lng)) {
    return;
  }

  return {
    address,
    placeId,
    lat,
    lng,
  };
};

const parseExistingImages = (body: Record<string, unknown>) => {
  const existingImagesJson = getSingleFormValue(body.existingImagesJson);

  if (existingImagesJson) {
    try {
      const parsedValue = JSON.parse(existingImagesJson);
      if (Array.isArray(parsedValue)) {
        return parsedValue.filter(
          (entry): entry is string => typeof entry === "string" && entry.length > 0,
        );
      }
    } catch {
      return [];
    }
  }

  if (!body.existingImages) {
    return [];
  }

  if (Array.isArray(body.existingImages)) {
    return body.existingImages.filter(
      (entry): entry is string => typeof entry === "string" && entry.length > 0,
    );
  }

  if (typeof body.existingImages === "string" && body.existingImages.length > 0) {
    return [body.existingImages];
  }

  return [];
};

type ProductFilters = {
  isMarkedSold: { $in: Array<boolean | null> };
  price?: {
    $gte?: number;
    $lte?: number;
  };
  condition?: string | string[];
  tags?: {
    $in: string[];
  };
};

type ProductSort = Partial<Record<"price" | "timeCreated" | "condition", 1 | -1>>;

const getStringQueryValue = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }
};

const getStringArrayQueryValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }
};

/**
 * get all the products in database (keep filters, sorting in mind)
 */
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sortBy, order, minPrice, maxPrice, condition, tags } = req.query;
    const sortByValue = getStringQueryValue(sortBy);
    const orderValue = getStringQueryValue(order);
    const minPriceValue = getStringQueryValue(minPrice);
    const maxPriceValue = getStringQueryValue(maxPrice);
    const conditionValue = getStringQueryValue(condition);
    const tagArrayValue = getStringArrayQueryValue(tags);

    // object containing different filters we can apply
    const filters: ProductFilters = {
      isMarkedSold: { $in: [false, null] },
    };

    // Check for filters and add them to object
    if (minPriceValue || maxPriceValue) {
      filters.price = {};
      if (minPriceValue) filters.price.$gte = Number(minPriceValue);
      if (maxPriceValue) filters.price.$lte = Number(maxPriceValue);
    }

    // Filter by specific condition
    if (conditionValue) {
      filters.condition = conditionValue;
    }

    // Filter by category
    if (tags) {
      // Handle both single tag and multiple tags
      let tagArray: string[];

      if (tagArrayValue) {
        // Already an array: ?tags=Electronics&tags=Furniture
        tagArray = tagArrayValue;
      } else if (typeof tags === "string") {
        // Single string, could be comma-separated: ?tags=Electronics,Furniture
        tagArray = tags.includes(",") ? tags.split(",").map((t) => t.trim()) : [tags];
      } else {
        tagArray = [];
      }

      if (tagArray.length > 0) {
        filters.tags = { $in: tagArray };
      }
    }

    // sort object for different sorting options
    const sortTypes: ProductSort = {};

    if (sortByValue) {
      const sortOrder = orderValue === "asc" ? 1 : -1;

      switch (sortByValue) {
        case "price":
          sortTypes.price = sortOrder;
          break;
        case "timeCreated":
          sortTypes.timeCreated = sortOrder;
          break;
        case "condition":
          sortTypes.condition = sortOrder;
          break;
        default:
          // newest is default
          sortTypes.timeCreated = -1;
      }
    } else {
      // default sorting by newest
      sortTypes.timeCreated = -1;
    }

    const products = await ProductModel.find(filters).sort(sortTypes);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

/**
 * get individual product thru product id
 */
export const getProductById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error getting product", error });
  }
};

/*
 * search for product by name
 */
export const getProductsByName = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const query = req.params.query;
    const products = await ProductModel.find({
      name: { $regex: query, $options: "i" },
      isMarkedSold: { $in: [false, null] },
    });
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error getting product", error });
  }
};

/**
 * add product to database thru name, price, description, userEmail, and condition
 */
export const addProduct = [
  upload,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { name, price, description, category, condition, year } = req.body;
      const pickupLocation = parsePickupLocation(req.body as Record<string, unknown>);
      if (!req.user) return res.status(404).json({ message: "User not found" });
      const userId = req.user._id;
      const userEmail = req.user.userEmail;
      if (!name || !price || !userEmail || !condition) {
        return res
          .status(400)
          .json({ message: "Name, price, userEmail, and condition are required." });
      }

      const tags = category ? [category] : [];

      const images: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        const app = initializeApp(firebaseConfig);
        const storage = getStorage(app);

        for (const file of req.files as Express.Multer.File[]) {
          const fileName = `${uuidv4()}-${file.originalname}`;
          const firebaseFile = bucket.file(fileName);

          await firebaseFile.save(file.buffer, {
            metadata: { contentType: file.mimetype },
          });

          const imageUrl = await getDownloadURL(ref(storage, fileName));
          images.push(imageUrl);
        }
      }

      const newProduct = new ProductModel({
        name,
        price,
        description,
        year: year ? Number(year) : undefined,
        category: category || undefined,
        userEmail,
        images,
        condition,
        tags,
        pickupLocation,
        timeCreated: new Date(),
        timeUpdated: new Date(),
      });

      const savedProduct = await newProduct.save();
      await UserModel.findByIdAndUpdate(userId, {
        $push: { productList: savedProduct._id },
      });
      res.status(201).json(savedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
    }
  },
];

/**
 * delete product from database thru id
 */
export const deleteProductById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!req.user) return res.status(404).json({ message: "User not found" });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.productList.includes(id)) {
      return res.status(400).json({ message: "User does not own this product" });
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    await UserModel.findByIdAndUpdate(userId, { $pull: { productList: id } });
    res.status(200).json({ message: "Product successfully deleted", deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// /**
//  * patch product in database thru id and updated parameters in req
//  */
export const updateProductById = [
  upload,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
      if (!req.user) return res.status(404).json({ message: "User not found" });
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: "Invalid ID format" });

      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.productList.includes(id)) {
        return res.status(400).json({ message: "User does not own this product" });
      }

      // handle tags input
      let tags: string[] | undefined;
      if (req.body.category) {
        tags = [req.body.category];
      }

      const existingImages = parseExistingImages(req.body as Record<string, unknown>);
      const pickupLocation = parsePickupLocation(req.body as Record<string, unknown>);

      const newUrls: string[] = [];
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      for (const file of req.files as Express.Multer.File[]) {
        const name = `${uuidv4()}-${file.originalname}`;
        const bucketFile = bucket.file(name);
        await bucketFile.save(file.buffer, { metadata: { contentType: file.mimetype } });
        newUrls.push(await getDownloadURL(ref(storage, name)));
      }

      const finalImages = [...existingImages, ...newUrls];

      const updateData: Record<string, unknown> = {
        images: finalImages,
        timeUpdated: new Date(),
      };

      const name = getSingleFormValue(req.body.name);
      if (name !== undefined) {
        updateData.name = name;
      }

      const price = getSingleFormValue(req.body.price);
      if (price !== undefined) {
        const parsedPrice = Number(price);
        if (!Number.isNaN(parsedPrice)) {
          updateData.price = parsedPrice;
        }
      }

      const description = getSingleFormValue(req.body.description);
      if (description !== undefined) {
        updateData.description = description;
      }

      const condition = getSingleFormValue(req.body.condition);
      if (condition !== undefined) {
        updateData.condition = condition;
      }

      const category = getSingleFormValue(req.body.category);
      if (category !== undefined) {
        updateData.category = category;
      }

      const year = getSingleFormValue(req.body.year);
      if (year !== undefined) {
        const parsedYear = Number(year);
        if (!Number.isNaN(parsedYear)) {
          updateData.year = parsedYear;
        }
      }

      if (tags) {
        updateData.tags = tags;
      }

      const isMarkedSold = getSingleFormValue(req.body.isMarkedSold);
      if (isMarkedSold !== undefined) {
        updateData.isMarkedSold = isMarkedSold === "true";
      }

      if (pickupLocation) {
        updateData.pickupLocation = pickupLocation;
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product successfully updated",
        updatedProduct,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error";
      return res.status(500).json({
        message: "Error patching product",
        error: errorMessage,
      });
    }
  },
];
