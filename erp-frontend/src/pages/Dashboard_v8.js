import React, { useState, useEffect } from "react";
import api from "../services/api_v8";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

function Dashboard() {
  const [from, setFrom] = useState("2025-05-01");
  const [to, setTo] = useState("2025-05-16");
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [fySales, setFySales] = useState({});

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d88484", "#d8d484", "#84a9d8", "#84d89b", "#b684d8", "#84d8d8", "#a6d884"];

  const fetchAll = () => {
    api.get(`/reports/sales?from_date=${from}&to_date=${to}`).then(res => setSalesData(res.data));
    api.get(`/reports/top-products?from_date=${from}&to_date=${to}`).then(res => setTopProducts(res.data));
    api.get(`/reports/category-sales?from_date=${from}&to_date=${to}`).then(res => setCategorySales(res.data));
    api.get(`/reports/sales/by_financial_year`).then(res => setFySales(res.data));
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Sales Dashboard</Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", my: 2 }}>
        <TextField type="date" label="From" value={from} onChange={e => setFrom(e.target.value)} />
        <TextField type="date" label="To" value={to} onChange={e => setTo(e.target.value)} />
        <Button variant="contained" onClick={fetchAll}>Refresh</Button>
      </Box>
      {/* Sales Over Time */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">Sales Over Time</Typography>
        <LineChart width={600} height={300} data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#1976d2" />
        </LineChart>
      </Paper>
      {/* Top Products */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">Top Selling Products</Typography>
        <BarChart width={600} height={300} data={topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="quantity_sold" fill="#8884d8" />
        </BarChart>
      </Paper>
      {/* Category Sales */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">Sales by Category</Typography>
        <PieChart width={400} height={300}>
          <Pie data={categorySales} dataKey="sales_amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
            {categorySales.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Paper>
      {/* Financial Year Sales */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">Sales by Financial Year</Typography>
        <pre>{JSON.stringify(fySales, null, 2)}</pre>
      </Paper>
    </Box>
  );
}
export default Dashboard;