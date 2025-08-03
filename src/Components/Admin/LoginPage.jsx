import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiLock, FiMail } from "react-icons/fi";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginClicked, SetLoginClicked] = useState(false);
  const [otp, SetOtp] = useState("");
  const [responseData, setResponseData] = useState({ userid: "", otp: "" });
  const [role, setRole] = useState("");

  const OTP_SENDER = "https://asrlabs.asrhospitalindia.in/lims/authentication/signin";

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    SetLoginClicked(true);
    try {
      const response = await axios.post(OTP_SENDER, loginData);
      
      // Skip OTP for non-admin users
      if (response.data.role !== 'admin') {
        toast.success(`Login successful as ${response.data.role}! Redirecting...`);
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userid", response.data.id);
        window.location.reload();
        return;
      }
      
      toast.success("OTP sent to your email/phone.");
      setResponseData({ userid: response.data.id, otp: "" });
      SetOtp(response.data.otp);
      setRole(response.data.role);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userid", response.data.id);
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
      SetLoginClicked(false);
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
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 font-medium">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <FiLock />
              </span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={loginClicked}
                required
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginClicked}
            className={`w-full py-3 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ease-in-out text-sm font-medium ${
              loginClicked
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'
            }`}
          >
            {loginClicked && loginData.role === 'admin' ? 'Sending OTP...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4">
          <a
            href="#"
            className="forgot-password block text-center text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {localStorage.getItem('role') === 'admin' && otp && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Debug OTP: <span className="font-mono font-bold">{otp}</span></p>
          </div>
        )}
        
        {localStorage.getItem('role') === 'admin' && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-gray-600 font-medium">
                OTP
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  <FiLock />
                </span>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={responseData.otp}
                  onChange={(e) => setResponseData({...responseData, otp: e.target.value})}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-sm"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOtpSubmit}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-200 ease-in-out text-sm font-medium"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
