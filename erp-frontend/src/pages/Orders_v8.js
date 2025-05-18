import React, { useEffect, useState } from "react";
import api from "../services/api_v8";
import { Box, Typography, TextField, Button } from "@mui/material";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    supplier_id: "",
    total: "",
    auto_generated: false,
    requirement_by_date: "",
    payment_mode: "",
    delivery_address: ""
  });
  const [items, setItems] = useState([{ product_id: "", quantity: "", price: "" }]);

  useEffect(() => {
    api.get("/orders/").then(res => setOrders(res.data));
    api.get("/suppliers/").then(res => setSuppliers(res.data));
  }, []);

  const handleAddOrder = () => {
    api.post("/orders/", { ...form }, { params: { items: JSON.stringify(items) } }).then(res => {
      setOrders([...orders, res.data]);
    });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ m: 2 }}>Orders</Typography>
      {/* Order form for demonstration */}
      <Box>
        <TextField label="Supplier ID" value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: e.target.value })} />
        <TextField label="Total" value={form.total} onChange={e => setForm({ ...form, total: e.target.value })} />
        <TextField label="Requirement By Date" type="date" value={form.requirement_by_date} onChange={e => setForm({ ...form, requirement_by_date: e.target.value })} />
        <TextField label="Payment Mode" value={form.payment_mode} onChange={e => setForm({ ...form, payment_mode: e.target.value })} />
        <TextField label="Delivery Address" value={form.delivery_address} onChange={e => setForm({ ...form, delivery_address: e.target.value })} />
        <Button onClick={handleAddOrder}>Add Order</Button>
      </Box>
      {/* List orders */}
      <Box>
        {orders.map(order => (
          <Box key={order.id} sx={{ border: "1px solid #ccc", m: 1, p: 1 }}>
            Order #{order.id} for Supplier {order.supplier_id} - Total: {order.total}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
export default Orders;