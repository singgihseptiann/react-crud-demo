import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/data");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/data", { name: newItem });
      setData([...data, response.data]);
      setNewItem("");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleUpdateItem = async (id, newName) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/data/${id}`, { name: newName });
      setData(data.map((item) => (item.id === id ? response.data : item)));
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/data/${id}`);
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpload = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(`http://localhost:3001/api/data/upload?id=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        fetchData(); // Ambil data lagi setelah upload berhasil
      } else {
        console.error("Error uploading image:", response.data.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                <input type="text" value={item.name} onChange={(e) => handleUpdateItem(item.id, e.target.value)} />
              </td>
              <td>
                {item.imageUrl && <img src={`http://localhost:3001/uploads/${item.imageUrl}`} alt={`Item ${item.id}`} style={{ maxWidth: "100px", maxHeight: "100px" }} />}
                <input type="file" accept="image/*" onChange={(e) => handleUpload(item.id, e.target.files[0])} />
              </td>
              <td>
                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
    </div>
  );
};

export default App;
