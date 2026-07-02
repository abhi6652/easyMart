const Product = require("../model/Product");

const searchProducts = async (userQuery) => {
  const products = await Product.find({});

  const keywords = userQuery
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2);

  return products.filter((product) => {
    const searchableText = `
      ${product.name}
      ${product.description}
      ${product.category}
      ${product.brand || ""}
    `.toLowerCase();

    return keywords.some((keyword) =>
      searchableText.includes(keyword)
    );
  });
};

module.exports = {
  searchProducts,
};