const parseQuery = (userQuery) => {
  const query = userQuery.toLowerCase().trim();

  // Detect price
  const priceMatch = query.match(/under\s+(\d+)/);
  const maxPrice = priceMatch ? Number(priceMatch[1]) : null;

  // Common words to ignore
  const stopWords = [
    "best",
    "suggest",
    "recommend",
    "show",
    "find",
    "me",
    "please",
    "under"
  ];

  const keywords = query
    .replace(/under\s+\d+/, "")
    .split(" ")
    .filter(word => word && !stopWords.includes(word));

  return {
    maxPrice,
    keywords
  };
};

module.exports = {
  parseQuery
};