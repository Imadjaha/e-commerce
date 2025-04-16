import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../slices/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Lock } from "lucide-react";
import { Link } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const action = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(action)) {
      navigate("/");
    } else {
      setError("Invalid Username or Password");
      setUsername("");
      setPassword("");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto overflow-auto py-20">
      <div className="flex flex-col bg-white dark:bg-gray-800 shadow-md rounded-md px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin}>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Username
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <User className="ml-2 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-300"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 dark:text-gray-300">
              Password
            </label>
            <div className="flex items-center border rounded-md bg-white dark:bg-gray-700">
              <Lock className="ml-2 text-gray-400" />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-800 dark:text-gray-300"
              />
            </div>
          </div>
          <div className="mb-4 flex items-center"></div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Login
          </button>
          <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-300"> Don't have an account? {" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 hover:underline"
            >
             Register
            </Link> </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
