import { Toaster, toast } from "react-hot-toast";
import StockChart from "./components/StockChart";
import History from "./components/History";
import Login from "./components/Login";
import Stats from "./components/Stats";

import "./App.css";

import { useEffect, useState } from "react";

import api from "./api/api";

import socket from "./socket/socket";

function App() {
  const [products, setProducts] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token"));

  const [name, setName] = useState("");

  const [stock, setStock] = useState("");

  const [image, setImage] = useState(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newStock, setNewStock] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?search=${search}&page=${page}`);

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();

    const handleUpdate = () => {
      fetchProducts();
    };

    socket.on("productUpdated", handleUpdate);

    return () => {
      socket.off("productUpdated", handleUpdate);
    };
  }, [search, page]);

  const createProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);

      formData.append("stock", stock);

      if (image) {
        formData.append("image", image);
      }

      await api.post(
        "/products",

        formData,
      );

      toast.success("Ürün eklendi");

      setName("");
      setStock("");
      setImage(null);

      fetchProducts();
    } catch (error) {
      toast.error("Hata oluştu");

      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
  };

  const updateStock = async (id, currentStock) => {
    setSelectedProduct(id);

    setNewStock(currentStock);

    return;

    if (!newStock) return;

    try {
      await api.patch(
        `/products/${id}`,

        {
          stock: Number(newStock),
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchProducts();
      toast.success("Stok güncellendi");
    } catch (error) {
      toast.error("Bir hata oluştu");
      console.log(error);
    }
  };

  const saveStock = async () => {
    try {
      await api.patch(
        `/products/${selectedProduct}`,

        {
          stock: Number(newStock),
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Stock güncellendi");

      setSelectedProduct(null);

      fetchProducts();
    } catch (error) {
      toast.error("Hata oluştu");

      console.log(error);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = confirm("Ürünü silmek istiyor musun?");

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/products/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchProducts();
      toast.success("Ürün silindi");
    } catch (error) {
      toast.error("Bir hata oluştu");
      console.log(error);
    }
  };

  const updateImage = async (id, file) => {
    try {
      const formData = new FormData();

      formData.append("image", file);

      await api.patch(
        `/products/${id}`,

        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Görsel güncellendi");

      fetchProducts();
    } catch (error) {
      toast.error("Hata oluştu");

      console.log(error);
    }
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="container">
      <Toaster />
      <h1>Depo Yönetim Paneli</h1>

      <Stats />

      <div className="top-bar">
        <button className="logout-btn" onClick={logout}>
          Çıkış Yap
        </button>

        <input
          type="text"
          placeholder="Ürün ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Ürün adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button onClick={createProduct}>Ürün Ekle</button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={
                product.image
                  ? `http://localhost:3000${product.image}`
                  : "/no-image.png"
              }
              alt={product.name}
              className="product-image"
            />

            <h2>{product.name}</h2>

            <p>Stock: {product.stock}</p>

            {product.stock < 5 && <p className="low-stock">⚠ Düşük Stock</p>}

            <button onClick={() => updateStock(product.id, product.stock)}>
              Stock Güncelle
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteProduct(product.id)}
            >
              Sil
            </button>

            <label className="upload-btn">
              Görsel Değiştir
              <input
                type="file"
                hidden
                onChange={(e) =>
                  updateImage(
                    product.id,

                    e.target.files[0],
                  )
                }
              />
            </label>
          </div>
        ))}
      </div>

      <div className="bottom-grid">
        <History />

        <StockChart products={products} />
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Önceki
        </button>

        <span>Sayfa {page}</span>

        <button onClick={() => setPage(page + 1)}>Sonraki</button>
        {selectedProduct && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Stock Güncelle</h2>

              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />

              <div className="modal-buttons">
                <button className="save-btn" onClick={saveStock}>
                  Kaydet
                </button>

                <button
                  className="delete-btn"
                  onClick={() => setSelectedProduct(null)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
