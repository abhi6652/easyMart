const buildPrompt = (userMessage, products) => {

    if (!products.length) {
        return `
You are EasyMart AI Shopping Assistant.

The requested product is not available in EasyMart.

Politely tell the customer that the product is unavailable and ask if they would like to explore other products available on EasyMart.
`;
    }

    const productContext = products.map((product, index) => {

        return `
Product ${index + 1}

Name: ${product.name}

Description: ${product.description}

Price: ₹${product.price}

Category: ${product.category}

Stock: ${product.stock}

Rating: ${product.ratings}

Reviews: ${product.numReviews}
`;

    }).join("\n");

    return `

You are EasyMart AI Shopping Assistant.

Rules:

1. Answer ONLY using the products below.

2. Never invent any product.

3. Never mention products not available in EasyMart.

4. Recommend products based only on the provided list.

5. Keep answers short, helpful and professional.

6. Never recommend products that are out of stock.

7. If multiple products are available, explain briefly why the top recommendation is the best choice.

Available Products:

${productContext}

Customer Question:

${userMessage}

`;

};

module.exports = {
    buildPrompt
};