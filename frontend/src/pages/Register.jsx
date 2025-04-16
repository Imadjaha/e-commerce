import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../ThemeContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, Mail , ArrowLeft,MapPin} from "lucide-react";
import { motion } from "framer-motion";
import { Snackbar, Alert as MuiAlert } from "@mui/material";
import { registerUser } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { status, error } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
  });
  const { username, email, password, confirmPassword, address } = userData;

  const [errors, setErrors] = useState({});

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const [success, setSuccess] = useState(false);

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }
    const action = await dispatch(registerUser(userData));

    if (registerUser.rejected.match(action)) {
      const errorMessage = action.payload;
      if (errorMessage === "User already exists") {
        setErrors({ username: "User already exists" });
      } else if (errorMessage === "Email already exists") {
        setErrors({ email: "Email already exists" });
      } else if (errorMessage === "Invalid email format") {
        setErrors({ email: "Invalid email format" });
      } else {
        setErrors({ username: "Registration failed" });
      }
    } else {
      setSnackbar({
        open: true,
        message: "Account created successfully",
        severity: "success",
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 pt-10">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-md px-8 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Create an Account</h1>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 text-green-800 bg-green-100 border border-green-200 rounded-md"
          >
            Account created successfully! Redirecting to login...
          </motion.div>
        )}
        <form onSubmit={handleRegister}>
          {errors.general && (
            <div className="mb-4 text-red-500">{errors.general}</div>
          )}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Username
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <User className="mx-2" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                placeholder="Enter Your Username"
                required
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">{errors.username}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Email
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <Mail className="mx-2" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter Your Email"
                required
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Password
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <Lock className="mx-2" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter Your Password"
                required
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <Lock className="mx-2" />
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Confirm Your Password"
                required
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
            {errors.confirmPassword && (
              <div className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Address
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <MapPin className="mx-2" />
              <input
                type="text"
                name="address"
                value={address}
                onChange={onChange}
                placeholder="Enter Your Address"
                required
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Register
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
