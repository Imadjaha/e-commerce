import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slices/authSlice";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NavBar = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatach = useDispatch();

  const handleLogout = () => {
    dispatach(logout());
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar className="w-full flex justify-between">
          {/* Left: Products link */}
          <Typography variant="h6" component="div">
            <Link to="/" className="text-white hover:text-gray-300">
              Products
            </Link>
          </Typography>

      
          {token && (
            <div className="flex gap-4 items-center">
              <Typography variant="h6" component="div">
                <Link to="/cart" className="text-white hover:text-gray-300">
                  Cart
                </Link>
              </Typography>
              <Typography variant="h6" component="div">
                <Link to="/orders" className="text-white hover:text-gray-300">
                  Orders
                </Link>
              </Typography>
            </div>
          )}

          {/* Right: Logout or Auth */}
          <Box>
            {token ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button color="inherit">
                  <Link to="/login" className="text-white hover:text-gray-300">
                    Login
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link
                    to="/register"
                    className="text-white hover:text-gray-300"
                  >
                    Register
                  </Link>
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
