import React, { useState } from "react";
import api from "../services/api_v8";
import { Button, TextField, Typography, Box } from "@mui/material";

function Login({ setToken, setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/users/token", new URLSearchParams({
        username,
        password
      }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      setToken(res.data.access_token);
      const decoded = JSON.parse(atob(res.data.access_token.split(".")[1]));
      setRole(decoded.role);
      setError("");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mx: "auto", mt: 8 }}>
      <Typography variant="h6">ERP Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Username" value={username}
          onChange={e => setUsername(e.target.value)} fullWidth margin="normal" />
        <TextField type="password" label="Password" value={password}
          onChange={e => setPassword(e.target.value)} fullWidth margin="normal" />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
      </form>
    </Box>
  );
}

export default Login;