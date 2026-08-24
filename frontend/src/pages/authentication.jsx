import Close from "@mui/icons-material/Close";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Link,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6c63ff" },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#ffffff",
            "& fieldset": { borderColor: "#e4e4f0" },
            "&:hover fieldset": { borderColor: "#b0aee8" },
            "&.Mui-focused fieldset": { borderColor: "#6c63ff", borderWidth: 2 },
          },
          "& .MuiInputBase-input::placeholder": { color: "#b0b0c3", opacity: 1 },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: "none", fontWeight: 700, letterSpacing: "0.2px" },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "0.95rem",
        },
      },
    },
  },
});

export default function Authentication() {

  const navigate = useNavigate();
  const [tab, setTab] = useState(0); // 0 = Sign Up, 1 = Sign In
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const handleSubmit = async () => {
  const url =
    tab === 0
      ? "https://viora-backend-g4i0.onrender.com/api/v1/users/register"
      : "https://viora-backend-g4i0.onrender.com/api/v1/users/login";

  const body =
    tab === 0
      ? {
          name: form.name,
          username: form.email,
          password: form.password,
        }
      : {
          username: form.email,
          password: form.password,
        };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    if (tab === 0) {
      alert("Account created successfully!");
      setTab(1);
    } else {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/dashboard");
    }
  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server");
  }
};

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0eeff 0%, #e8f0ff 50%, #f5f0ff 100%)",
          p: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            borderRadius: 5,
            overflow: "hidden",
            width: "100%",
            maxWidth: 880,
            minHeight: 580,
            boxShadow: "0 24px 72px rgba(108,99,255,0.13)",
          }}
        >
          {/* LEFT PANEL */}
          <Box
            sx={{
              flex: "0 0 46%",
              p: { xs: 3, sm: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "linear-gradient(170deg, #fafaff 0%, #f3f0ff 100%)",
            }}
          >
            <Box>
              {/* Logo */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 4 }}>
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #63b4ff 0%, #0c581f 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1rem", lineHeight: 1 }}>
                    V
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ letterSpacing: "-0.5px", color: "#1a1a2e" }}
                >
                  VIORA
                </Typography>
              </Box>

              {/* Tabs */}
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  mb: 3,
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#63c1ff",
                    height: 3,
                    borderRadius: 2,
                  },
                  "& .Mui-selected": { color: "#023011 !important" },
                  "& .MuiTab-root": { color: "#9a9ab0", minWidth: 0, px: 0, mr: 3 },
                }}
              >
                <Tab label="Create Account" />
                <Tab label="Sign In" />
              </Tabs>

              
              {tab === 1 && (
                <Typography variant="body2" color="text.secondary" mb={2.5}>
                  Welcome back! Sign in to continue.
                </Typography>
              )}

              {/* Fields */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                {tab === 0 && (
                  <TextField
                    placeholder="Full name"
                    value={form.name}
                    onChange={handleChange("name")}
                    fullWidth
                  />
                )}
                <TextField
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange("email")}
                  fullWidth
                />
                <TextField
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange("password")}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {tab === 1 && (
                  <Box sx={{ textAlign: "right", mt: -1 }}>
                    <Link href="#" variant="caption" underline="hover" sx={{ color: "#6dd6e9", fontWeight: 600 }}>
                      {/* Forgot password? */}
                    </Link>
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                  sx={{
                    mt: 0.5,
                    background: "linear-gradient(135deg,rgb(0, 81, 0) 0%, #8bd5fa 100%)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    py: 1.6,
                    boxShadow: "0 6px 20px rgba(108,99,255,0.35)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6ae052 0%, #ca70f0 100%)",
                      boxShadow: "0 8px 24px rgba(99, 193, 255, 0.45)",
                    },
                  }}
                >
                  {tab === 0 ? "Get Started" : "Sign In"}
                </Button>

                <Divider sx={{ my: 0.2 }}>
                  <Typography variant="caption" color="text.secondary">or</Typography>
                </Divider>

                {/* <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={
                    <Box
                      component="img"
                      src="https://www.google.com/favicon.ico"
                      alt="G"
                      sx={{ width: 18, height: 18 }}
                    />
                  }
                  sx={{
                    borderColor: "#e4e4f0",
                    color: "#333",
                    backgroundColor: "#fff",
                    fontWeight: 600,
                    py: 1.4,
                    "&:hover": { backgroundColor: "#fafaff", borderColor: "#b0aee8" },
                  }}
                >
                  Continue with Google
                </Button> */}
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                {tab === 0 ? "Already have an account? " : "Don't have an account? "}
                <Link
                  href="#"
                  underline="hover"
                  fontWeight={700}
                  sx={{ color: "#6dd6e9" }}
                  onClick={(e) => { e.preventDefault(); setTab(tab === 0 ? 1 : 0); }}
                >
                  {tab === 0 ? "Sign in" : "Create one"}
                </Link>
              </Typography>
              <Link href="#" variant="caption" underline="always" color="text.secondary">
                Terms & Privacy
              </Link>
            </Box>
          </Box>

          {/* RIGHT PANEL — blurred image */}
          <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <Box
              component="img"
              src="/authenticationimg.avif"
              alt="VIORA workspace"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "blur(4px) brightness(0.72)",
                transform: "scale(1.06)",
              }}
            />
            {/* Purple-tinted overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(123, 228, 239, 0.25) 0%, rgba(30,20,80,0.3) 100%)",
              }}
            />
            {/* Close button */}
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 14,
                right: 14,
                backgroundColor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(4px)",
                "&:hover": { backgroundColor: "#fff" },
                width: 34,
                height: 34,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <Close fontSize="small" />
            </IconButton>

            {/* Centered tagline on image */}
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: 0,
                right: 0,
                textAlign: "center",
                px: 3,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,0.4)", letterSpacing: "-0.3px" }}
              >
                Connect. Collaborate. Close.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5, textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}
              >
                Your all-in-one calling platform.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

