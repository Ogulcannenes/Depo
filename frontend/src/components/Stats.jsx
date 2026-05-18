import { useEffect, useState } from "react";

import api from "../api/api";

import socket from "../socket/socket";

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/products/stats");

        setStats(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();

    socket.on("productUpdated", fetchStats);

    return () => {
      socket.off("productUpdated", fetchStats);
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Toplam Ürün</h3>

        <p>{stats.totalProducts}</p>
      </div>

      <div className="stat-card">
        <h3>Toplam Stok</h3>

        <p>{stats.totalStock}</p>
      </div>

      <div className="stat-card">
        <h3>Düşük Stok</h3>

        <p>{stats.lowStock}</p>
      </div>

      <div className="stat-card">
        <h3>Toplam Hareket</h3>

        <p>{stats.totalHistory}</p>
      </div>
    </div>
  );
}

export default Stats;
