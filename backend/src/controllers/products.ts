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

/**
 * get all the products in database (keep filters, sorting in mind)
 */
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sortBy, order, minPrice, maxPrice, condition, tags } = req.query;

    // object containing different filters we can apply
    const filters: any = {}; 
  
    // Check for filters and add them to object
    if(minPrice || maxPrice) {
      filters.price = {};
      if(minPrice) filters.price.$gte = Number(minPrice);
      if(maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Filter by specific condition
    if(condition) {
      filters.condition = condition;
    }

    // Filter by tags
    if(tags) {
      // Handle both single tag and multiple tags
      let tagArray: string[];
      
      if (Array.isArray(tags)) {

        // Already an array: ?tags=Electronics&tags=Furniture
        tagArray = tags as string[];
      } else if (typeof tags === 'string') {

        // Single string, could be comma-separated: ?tags=Electronics,Furniture
        tagArray = tags.includes(',') ? tags.split(',').map(t => t.trim()) : [tags];
      
      } else {
        tagArray = [];
      }

      if (tagArray.length > 0) {
        filters.tags = { $in: tagArray };
      }
    }

    // sort object for different sorting options
    const sortTypes: any = {}

    if(sortBy) {
      const sortOrder = order === "asc" ? 1 : -1;
      
      switch(sortBy) {
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
    const products = await ProductModel.find({ name: { $regex: query, $options: "i" } });
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
      const { name, price, description, category, condition } = req.body;
      if (!req.user) return res.status(404).json({ message: "User not found" });
      const userId = req.user._id;
      const userEmail = req.user.userEmail;
      if (!name || !price || !userEmail || !condition) {
        return res.status(400).json({ message: "Name, price, userEmail, and condition are required." });
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
        userEmail,
        images,
        condition,
        tags,
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

      let existing = req.body.existingImages || [];
      if (!Array.isArray(existing)) existing = [existing];

      const newUrls: string[] = [];
      const app = initializeApp(firebaseConfig);
      const storage = getStorage(app);
      for (const file of req.files as Express.Multer.File[]) {
        const name = `${uuidv4()}-${file.originalname}`;
        const bucketFile = bucket.file(name);
        await bucketFile.save(file.buffer, { metadata: { contentType: file.mimetype } });
        newUrls.push(await getDownloadURL(ref(storage, name)));
      }

      const finalImages = [...existing, ...newUrls];

      const updateData: any = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        condition: req.body.condition,
        images: finalImages,
        timeUpdated: new Date(),
      };

      if (tags) {
        updateData.tags = tags;
      }

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({
        message: "Product successfully updated",
        updatedProduct,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Error patching product",
        error: err.message || err.toString(),
      });
    }
  },
];
