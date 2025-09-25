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

// Chart.js bileşenlerini kaydedelim
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Veri türünü belirtmek için typescript interface kullanabiliriz
interface VisitorChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  };
}

const VisitorChart = ({ data }: VisitorChartProps) => {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
      <h3 className="text-xl font-medium">Program Tablosu</h3>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Program Türleri",
              },
            },
            y: {
              title: {
                display: true,
                text: "Program Sayıları",
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default VisitorChart;
