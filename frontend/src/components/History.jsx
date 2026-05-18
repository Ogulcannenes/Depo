import { useEffect, useState } from "react";

import api from "../api/api";

import socket from "../socket/socket";

function History() {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/history",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchHistory();

    const handleUpdate = () => {
      fetchHistory();
    };

    socket.on("productUpdated", handleUpdate);

    return () => {
      socket.off("productUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="history-box">
      <h2>Stock Geçmişi</h2>

      {history.map((item) => (
        <div className="history-item" key={item.id}>
          <strong>{item.product.name}</strong>

          <p>
            {item.oldStock}
            {" → "}
            {item.newStock}
          </p>
        </div>
      ))}
    </div>
  );
}

export default History;
