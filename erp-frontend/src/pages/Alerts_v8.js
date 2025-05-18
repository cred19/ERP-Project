import React, { useEffect, useState } from "react";
import api from "../services/api_v8";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    api.get("/inventory/alerts/")
      .then(res => setAlerts(res.data));
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ m: 2 }}>Stock Alerts</Typography>
      {alerts.length === 0 ? (
        <Typography sx={{ m: 2 }}>No products need restocking.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Reorder Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.sku}</TableCell>
                  <TableCell>{row.quantity_in_stock}</TableCell>
                  <TableCell>{row.reorder_threshold}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
export default Alerts;