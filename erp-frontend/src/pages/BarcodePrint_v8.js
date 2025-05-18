import React, { useState } from "react";
import api from "../services/api_v8";
import { Box, Button, TextField, Typography } from "@mui/material";

function BarcodePrint() {
  const [productId, setProductId] = useState("");
  const [imgUrl, setImgUrl] = useState(null);

  const handleGetBarcode = () => {
    api.get(`/barcode/product/${productId}/image`, { responseType: 'blob' }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setImgUrl(url);
    });
  };

  return (
    <Box>
      <Typography variant="h6">Barcode Print</Typography>
      <TextField label="Product ID" value={productId} onChange={e => setProductId(e.target.value)} />
      <Button onClick={handleGetBarcode}>Get Barcode</Button>
      {imgUrl && <img src={imgUrl} alt="Barcode" />}
    </Box>
  );
}

export default BarcodePrint;