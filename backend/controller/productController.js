const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      ram,
      storage,
      processor,
      battery,
      tags,
      stock,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      ram,
      storage,
      processor,
      battery,
      tags: tags ? JSON.parse(tags) : [],
      stock,
      imageUrl: result.secure_url,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price =
  req.body.price !== undefined ? req.body.price : product.price;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.ram = req.body.ram || product.ram;
    product.storage = req.body.storage || product.storage;
    product.processor = req.body.processor || product.processor;
    product.battery = req.body.battery || product.battery;
    product.stock =
  req.body.stock !== undefined ? req.body.stock : product.stock;

    if (req.body.tags) {
      product.tags = JSON.parse(req.body.tags);
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.imageUrl = result.secure_url;
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product removed successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};