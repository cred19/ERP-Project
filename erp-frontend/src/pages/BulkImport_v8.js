import React, { useRef } from "react";
import api from "../services/api_v8";
import { Box, Button, Typography } from "@mui/material";

function BulkImport() {
  const prodFileRef = useRef();
  const suppFileRef = useRef();

  const handleImportProducts = () => {
    const file = prodFileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    api.post("/bulk_import/products/", formData, { headers: { "Content-Type": "multipart/form-data" } });
  };

  const handleImportSuppliers = () => {
    const file = suppFileRef.current.files[0];
    const formData = new FormData();
    formData.append("file", file);
    api.post("/bulk_import/suppliers/", formData, { headers: { "Content-Type": "multipart/form-data" } });
  };

  return (
    <Box>
      <Typography variant="h6">Bulk Import</Typography>
      <Box>
        <input type="file" ref={prodFileRef} />
        <Button onClick={handleImportProducts}>Import Products</Button>
      </Box>
      <Box>
        <input type="file" ref={suppFileRef} />
        <Button onClick={handleImportSuppliers}>Import Suppliers</Button>
      </Box>
    </Box>
  );
}

export default BulkImport;