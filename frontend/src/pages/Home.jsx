import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);

        // ❌ HTML crash protection
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error("Invalid API response");
        }

        const data = await res.json();

        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error("Products Fetch Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-banner">
        <h1>Welcome to easyMart</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>

      <h2>Featured Products</h2>

      {loading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div>No products found</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;