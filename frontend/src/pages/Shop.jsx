useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server returned HTML instead of JSON. Check API_URL or backend route.");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);