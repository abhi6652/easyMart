import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const AddProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    tags: "",
    ram: "",
    storage: "",
    processor: "",
    battery: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      return alert("Please select an image");
    }

    setLoading(true);

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("brand", formData.brand);
    data.append("ram", formData.ram);
    data.append("storage", formData.storage);
    data.append("processor", formData.processor);
    data.append("battery", formData.battery);
    data.append("tags", JSON.stringify(formData.tags.split(",")));
    data.append("image", image);

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data,
      });

      const responseData = await res.json();

      if (res.ok) {
        alert("✅ Product created successfully!");
        navigate("/shop");
      } else {
        alert(responseData.message || "Error creating product");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        background: "#18181b",
        padding: "40px",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ color: "#ff6b16", marginBottom: "20px" }}>
        Add New Product
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          required
          rows="4"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Price"
          required
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Category"
          required
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Brand"
          value={formData.brand}
          onChange={(e) =>
            setFormData({ ...formData, brand: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="RAM"
          value={formData.ram}
          onChange={(e) =>
            setFormData({ ...formData, ram: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Storage"
          value={formData.storage}
          onChange={(e) =>
            setFormData({ ...formData, storage: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Processor"
          value={formData.processor}
          onChange={(e) =>
            setFormData({ ...formData, processor: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Battery"
          value={formData.battery}
          onChange={(e) =>
            setFormData({ ...formData, battery: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Stock"
          required
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          style={inputStyle}
        />

        <div
          style={{
            padding: "15px",
            border: "1px dashed #f97316",
          }}
        >
          <label
            style={{
              color: "#a1a1aa",
              display: "block",
              marginBottom: "10px",
            }}
          >
            Upload Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ color: "#fff" }}
          />
        </div>

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Uploading..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: "12px",
  background: "#09090b",
  border: "1px solid #27272a",
  borderRadius: "6px",
  color: "#fff",
};

export default AddProduct;