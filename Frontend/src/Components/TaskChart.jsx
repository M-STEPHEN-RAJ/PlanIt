import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TaskChart = ({ tasks }) => {
  // Count tasks by status
  const statusCounts = tasks.reduce((acc, task) => {
    const status = task.status.toLowerCase().trim();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const labels = ["Assigned", "In Progress", "Review", "Done"];
  const colors = ["#3B82F6", "#FACC15", "#A78BFA", "#22C55E"];

  const data = {
    labels,
    datasets: [
      {
        data: [
          statusCounts.assigned || 0,
          statusCounts.progress || 0,
          statusCounts.review || 0,
          statusCounts.done || 0,
        ],
        backgroundColor: colors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          boxWidth: 12,
        },
      },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="w-full max-w-[400px] mx-auto mt-5 p-4 border border-gray-300 rounded-lg">
      <h2 className="text-lg font-semibold">Task Status Overview</h2>
      <Pie data={data} options={options} />
    </div>
  );
};

export default TaskChart;
