
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart({ data }: { data: any }) {
  console.log("Data:", data);
  
  const parseData = (str: string) => {
    if (!str || typeof str !== "string") return [];
  
    console.log("🔹 Raw Input String:", str);
  
    // Remove surrounding quotes and trailing comma (if any)
    const cleanedStr = str.replace(/^'|'$/g, "").replace(/,\s*$/, "");
  
    console.log("🔸 After Cleaning:", cleanedStr);
  
    // Split the string into an array and clean each item
    const splitArray = cleanedStr.split(/','|,/).map(item => item.replace(/^'|'$/g, "").trim());
  
    console.log("🔹 After Split:", splitArray);
  
    // Convert values to numbers
    const finalArray = splitArray.map((num) => {
      return num === "" || isNaN(Number(num)) ? 0 : Number(num);
    });
  
    console.log("✅ Parsed Data:", finalArray);
    
    return finalArray;
  };

    const parseMonths = (str: string) => {
      if (!str || typeof str !== "string") return [];
      return str
        .replace(/(^'|'$)/g, "") // Remove surrounding single quotes
        .split(/','|,/) // Split by "','"
        .map((month) => month.trim().replace(/'$/, "")); // Remove trailing quote
    };
  const incomeData = parseData(data.income);
  const expenseData = parseData(data.expense);
  const profitData = parseData(data.profit);
  const months = parseMonths(data.months);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: "#007bff",
      },
      {
        label: "Expense",
        data: expenseData,
        backgroundColor: "#dc3545",
      },
      {
        label: "Profit",
        data: profitData,
        backgroundColor: "#ffc107",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
    },
    scales: {
      x: { stacked: false },
      y: {
        stacked: false,
        suggestedMin: 0,
        suggestedMax: Math.max(...incomeData, ...expenseData, ...profitData) + 50,
        ticks: {
          stepSize: 50,
        },
      },
    },
  };

  return (
    <div className="card-body">
      <Bar data={chartData} options={options} height={100} />
    </div>
  );
}