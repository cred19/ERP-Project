import React, { useEffect, useState } from "react";
import api from "../services/api_v8";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from "@mui/material";

function Inventory() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get("/inventory/product/")
      .then(res => setProducts(res.data));
  }, []);

  const handleDownloadBarcode = (id) => {
    api.get(`/barcode/product/${id}/image`, { responseType: 'blob' }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `barcode_${id}.png`);
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ m: 2 }}>Inventory</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Reorder Level</TableCell>
            <TableCell>Barcode</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{row.category_id}</TableCell>
              <TableCell>{row.unit}</TableCell>
              <TableCell>{row.price}</TableCell>
              <TableCell>{row.quantity_in_stock}</TableCell>
              <TableCell>{row.reorder_threshold}</TableCell>
              <TableCell>
                <Button onClick={() => handleDownloadBarcode(row.id)}>Download</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default Inventory;