import React, { useState } from "react";
import api from "../services/api_v8";
import { Box, Button, Typography, Select, MenuItem } from "@mui/material";

function DataExport() {
  const [period, setPeriod] = useState("this_month");
  const [excelUrl, setExcelUrl] = useState(null);

  const handleExport = () => {
    api.get(`/export/sales/excel?period=${period}`, { responseType: 'blob' }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setExcelUrl(url);
    });
  };

  return (
    <Box>
      <Typography variant="h6">Data Export</Typography>
      <Select value={period} onChange={e => setPeriod(e.target.value)}>
        <MenuItem value="today">Today</MenuItem>
        <MenuItem value="this_week">This Week</MenuItem>
        <MenuItem value="this_month">This Month</MenuItem>
        <MenuItem value="last_month">Last Month</MenuItem>
        <MenuItem value="last_3_months">Last 3 Months</MenuItem>
        <MenuItem value="last_6_months">Last 6 Months</MenuItem>
      </Select>
      <Button onClick={handleExport}>Export Sales</Button>
      {excelUrl && <a href={excelUrl} download="sales.xlsx">Download Sales Excel</a>}
    </Box>
  );
}

export default DataExport;