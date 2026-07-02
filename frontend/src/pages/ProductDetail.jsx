useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`);

      const text = await res.text(); // 👈 IMPORTANT FIX

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("API did not return JSON (HTML received). Check backend URL");
      }

      setProduct(data);
    } catch (error) {
      console.error("Product Fetch Error:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);