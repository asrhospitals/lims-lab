import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginClicked, setLoginClicked] = useState(false);
  const [otp, setOtp] = useState("");
  const [responseData, setResponseData] = useState({ userid: "", otp: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false); // NEW

  const OTP_SENDER =
    "https://asrlabs.asrhospitalindia.in/lims/authentication/signin";

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginClicked(true);

    const isAdmin = loginData.username.trim().toLowerCase() === "admin";
    setRequiresOtp(isAdmin);

    try {
      const response = await axios.post(OTP_SENDER, loginData);

      localStorage.setItem("hospital_name", response.data.hospitalname);
      localStorage.setItem("nodalname", response.data.nodalname);
      localStorage.setItem("nodal_id", response.data.nodalid);
      localStorage.setItem("hospital_id", response.data.hospitalid);
      localStorage.setItem("roleType", response.data.roleType);
      localStorage.setItem("role", response.data.role);

      if (isAdmin) {
        toast.success("OTP sent to your email/phone.");
        setResponseData({ userid: response.data.id, otp: "" });
        setOtp(response.data.otp); // for debug
      } else {
        toast.success("Login successful!");
        localStorage.setItem("authToken", response.data.token);
        window.location.reload();
      }
    } catch (err) {
      toast.error("Login failed. Please check your credentials1.");
      setLoginClicked(false);
    }
  };

  const handleOtpSubmit = async () => {
    const payload = {
      userid: responseData.userid,
      otp: parseInt(responseData.otp, 10),
    };
    try {
      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/verifyotp",
        payload
      );
      toast.success("OTP verified! Redirecting...");
      localStorage.setItem("authToken", response.data.token);
      window.location.reload();
    } catch (err) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200 font-poppins px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#d1fae5", color: "#065f46" } },
          error: { style: { background: "#fee2e2", color: "#991b1b" } },
        }}
      />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Sign In
        </h2>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="block text-sm mb-1 text-gray-600 font-medium">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <FiUser />
              </span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleLoginChange}
                disabled={loginClicked}
                required
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-200 text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-1 text-gray-600 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <FiLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={loginClicked}
                required
                className="w-full pl-10 pr-10 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-200 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loginClicked}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-md font-medium hover:from-cyan-400 hover:to-blue-500 transition duration-300 disabled:opacity-50 text-sm"
          >
            {loginClicked
              ? requiresOtp
                ? "Sending OTP..."
                : "Logging in..."
              : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>

        {otp && requiresOtp && (
          <p className="text-center mt-4 text-green-600 text-sm">
            <strong>Debug OTP:</strong> {otp}
          </p>
        )}

        {/* OTP Input */}
        {loginClicked && requiresOtp && (
          <div className="mt-6">
            <label className="block text-sm mb-1 text-gray-600 font-medium">
              Enter OTP
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <FiMail />
              </span>
              <input
                type="text"
                placeholder="Enter OTP"
                value={responseData.otp}
                onChange={(e) =>
                  setResponseData((prev) => ({
                    ...prev,
                    otp: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-400 transition duration-200 text-sm"
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white py-3 rounded-md hover:from-emerald-400 hover:to-green-500 transition duration-300 text-sm"
            >
              Submit OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
