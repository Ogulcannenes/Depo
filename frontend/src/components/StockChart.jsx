import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,

  LinearScale,

  BarElement,

  Title,

  Tooltip,

  Legend,
);

function StockChart({ products }) {
  const data = {
    labels: products.map((product) => product.name),

    datasets: [
      {
        label: "Stock",

        data: products.map((product) => product.stock),

        backgroundColor: "#3b82f6",
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="chart-box">
      <h2>Stok Grafiği</h2>

      <Bar data={data} options={options} />
    </div>
  );
}

export default StockChart;
