import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, ref, onValue, set, update } from "../firebase";
import "../styles.css";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [components, setComponents] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ name: "", image: null });
  const [newComponent, setNewComponent] = useState({ index: "", name: "", image: null });
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const compRef = ref(db, "components");
    const unsubscribe = onValue(compRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setComponents(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSelect = (index) => {
    set(ref(db, "selected_index"), index);
    setSelectedIndex(index);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditData({ name: components[index].name, image: null });
  };

  const handleEditSubmit = async () => {
    if (!editData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    setLoading(true);
    const updates = {};
    updates.name = editData.name.trim();

    try {
      if (editData.image) {
        const formData = new FormData();
        formData.append("image", editData.image);

        const imgbbRes = await fetch(
          "https://api.imgbb.com/1/upload?key=db21bef6e7f90eb4b4af06ad6915629e",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await imgbbRes.json();
        if (result.success) {
          updates.image = result.data.url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      await update(ref(db, `components/${editingIndex}`), updates);
      setEditingIndex(null);
      alert("✅ Component updated!");
    } catch (error) {
      console.error("Edit failed:", error);
      alert("❌ Failed to update component.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComponent = async () => {
    const { index, name, image } = newComponent;

    if (!index || !name || !image) {
      alert("❗ Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const imgbbRes = await fetch(
        "https://api.imgbb.com/1/upload?key=db21bef6e7f90eb4b4af06ad6915629e",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await imgbbRes.json();
      if (!result.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = result.data.url;
      const newEntry = {
        name: name.trim(),
        image: imageUrl,
      };

      await set(ref(db, `components/${index}`), newEntry);
      setNewComponent({ index: "", name: "", image: null });
      alert("✅ Component added successfully!");
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("❌ Failed to upload image or save to Firebase.");
    } finally {
      setLoading(false);
    }
  };

  const filteredComponents = Object.entries(components).filter(([_, comp]) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="dashboard-header">📦 Cloud-Based Smart Object Locator</div>
      
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#f3f3f3"
      }}>
        <input
          type="text"
          placeholder="🔍 Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "60%",
            maxWidth: "400px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />
        <button onClick={handleLogout} style={{
          padding: "8px 14px",
          border: "none",
          backgroundColor: "#dc3545",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          🚪 Log Out
        </button>
      </div>

      <div className="component-grid">
        {filteredComponents.map(([index, comp]) => (
          <div key={index} className="component-card">
            <img src={comp.image} alt={comp.name} />
            <h4>{comp.name}</h4>
            <button className="select-btn" onClick={() => handleSelect(index)}>
              Select
            </button>
            <button className="edit-btn" onClick={() => handleEdit(index)}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {editingIndex && (
        <div className="edit-section">
          <h3>Edit Component #{editingIndex}</h3>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="New name"
          />
          <input
            type="file"
            onChange={(e) => setEditData({ ...editData, image: e.target.files[0] })}
          />
          <button onClick={handleEditSubmit} disabled={loading}>
            {loading ? "Saving..." : "✅ Save"}
          </button>
          <button onClick={() => setEditingIndex(null)} disabled={loading}>
            ❌ Cancel
          </button>
        </div>
      )}

      <div className="add-section">
        <h3>➕ Add New Component</h3>
        <input
          type="text"
          placeholder="Index (e.g. 13)"
          required
          value={newComponent.index}
          onChange={(e) => setNewComponent({ ...newComponent, index: e.target.value })}
        />
        <input
          type="text"
          placeholder="Component name"
          required
          value={newComponent.name}
          onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
        />
        <input
          type="file"
          required
          onChange={(e) => setNewComponent({ ...newComponent, image: e.target.files[0] })}
        />
        <button onClick={handleAddComponent} disabled={loading}>
          {loading ? "Adding..." : "✅ Add"}
        </button>
      </div>
    </>
  );
}