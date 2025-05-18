import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login_v8";
import Inventory from "./pages/Inventory_v8";
import Suppliers from "./pages/Suppliers_v8";
import Orders from "./pages/Orders_v8";
import Alerts from "./pages/Alerts_v8";
import Dashboard from "./pages/Dashboard_v8";
import BulkImport from "./pages/BulkImport_v8";
import BarcodePrint from "./pages/BarcodePrint_v8";
import Reports from "./pages/Reports_v8";
import DataExport from "./pages/DataExport_v8";
import RoleProtectedRoute from "./components/RoleProtectedRoute_v8";
import { AppBar, Toolbar, Button } from "@mui/material";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || "staff");

  const handleSetToken = (tok) => {
    setToken(tok);
    localStorage.setItem("token", tok);
  };

  const handleSetRole = (role) => {
    setRole(role);
    localStorage.setItem("role", role);
  };

  if (!token) {
    return <Login setToken={handleSetToken} setRole={handleSetRole} />;
  }

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/alerts">Alerts</Button>
          <Button color="inherit" component={Link} to="/inventory">Inventory</Button>
          <Button color="inherit" component={Link} to="/suppliers">Suppliers</Button>
          <Button color="inherit" component={Link} to="/orders">Orders</Button>
          <Button color="inherit" component={Link} to="/bulkimport">Bulk Import</Button>
          <Button color="inherit" component={Link} to="/barcodeprint">Barcode Print</Button>
          <Button color="inherit" component={Link} to="/reports">Reports</Button>
          <Button color="inherit" component={Link} to="/dataexport">Data Export</Button>
          <Button color="inherit" onClick={() => { localStorage.clear(); setToken(null); setRole("staff"); }}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/bulkimport" element={<BulkImport />} />
        <Route path="/barcodeprint" element={<BarcodePrint />} />
        <Route path="/reports" element={
          <RoleProtectedRoute allowedRoles={["admin", "manager"]} userRole={role}>
            <Reports />
          </RoleProtectedRoute>
        } />
        <Route path="/dataexport" element={
          <RoleProtectedRoute allowedRoles={["admin", "manager"]} userRole={role}>
            <DataExport />
          </RoleProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;