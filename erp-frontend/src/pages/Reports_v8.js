import React, { useEffect, useState } from "react";
import api from "../services/api_v8";
import { Box, Typography, Button } from "@mui/material";

function Reports() {
  const [fySales, setFySales] = useState({});
  const [excelUrl, setExcelUrl] = useState(null);

  useEffect(() => {
    api.get("/reports/sales/by_financial_year").then(res => setFySales(res.data));
  }, []);

  const handleExport = () => {
    api.get("/export/sales/excel", { responseType: 'blob' }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setExcelUrl(url);
    });
  };

  return (
    <Box>
      <Typography variant="h6">Detailed Reports</Typography>
      <Button onClick={handleExport}>Export Sales Excel</Button>
      {excelUrl && <a href={excelUrl} download="sales.xlsx">Download Sales Excel</a>}
      <pre>{JSON.stringify(fySales, null, 2)}</pre>
    </Box>
  );
}

export default Reports;