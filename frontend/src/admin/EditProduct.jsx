import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const EditProduct = () => {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    ram: "",
    storage: "",
    processor: "",
    battery: "",
    tags: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);

        if (res.status === 401) {
          logout();
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();

        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          category: data.category || "",
          brand: data.brand || "",
          ram: data.ram || "",
          storage: data.storage || "",
          processor: data.processor || "",
          battery: data.battery || "",
          tags: Array.isArray(data.tags) ? data.tags.join(",") : "",
          stock: data.stock ?? "",
        });
      } catch (error) {
        console.error("Product Fetch Error:", error);
      }
    };

    fetchProduct();
  }, [id, logout]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          form.append(
            "tags",
            JSON.stringify(
              value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            )
          );
        } else {
          form.append(key, value);
        }
      });

      if (image) {
        form.append("image", image);
      }

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: form,
      });

      const response = await res.json();

      if (res.status === 401) {
        logout();
        return;
      }

      if (!res.ok) {
        throw new Error(response.message || "Update failed");
      }

      alert("✅ Product Updated Successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: "#f97316", marginBottom: "20px" }}>
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input style={inputStyle}
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Product Name"
        />

        <textarea style={inputStyle}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
        />

        <input style={inputStyle} type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: e.target.value })
          }
          placeholder="Price"
        />

        <input style={inputStyle}
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          placeholder="Category"
        />

        <input style={inputStyle}
          value={formData.brand}
          onChange={(e) =>
            setFormData({ ...formData, brand: e.target.value })
          }
          placeholder="Brand"
        />

        <input style={inputStyle}
          value={formData.ram}
          onChange={(e) =>
            setFormData({ ...formData, ram: e.target.value })
          }
          placeholder="RAM"
        />

        <input style={inputStyle}
          value={formData.storage}
          onChange={(e) =>
            setFormData({ ...formData, storage: e.target.value })
          }
          placeholder="Storage"
        />

        <input style={inputStyle}
          value={formData.processor}
          onChange={(e) =>
            setFormData({ ...formData, processor: e.target.value })
          }
          placeholder="Processor"
        />

        <input style={inputStyle}
          value={formData.battery}
          onChange={(e) =>
            setFormData({ ...formData, battery: e.target.value })
          }
          placeholder="Battery"
        />

        <input style={inputStyle}
          value={formData.tags}
          onChange={(e) =>
            setFormData({ ...formData, tags: e.target.value })
          }
          placeholder="Tags (comma separated)"
        />

        <input style={inputStyle} type="number"
          value={formData.stock}
          onChange={(e) =>
            setFormData({ ...formData, stock: e.target.value })
          }
          placeholder="Stock"
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ color: "#fff" }}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

// ================= STYLES =================
const containerStyle = {
  maxWidth: "650px",
  margin: "40px auto",
  background: "#18181b",
  padding: "40px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  padding: "12px",
  background: "#09090b",
  border: "1px solid #27272a",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
};

export default EditProduct;