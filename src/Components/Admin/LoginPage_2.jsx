import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiUser, FiLock, FiMail } from "react-icons/fi";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loginClicked, SetLoginClicked] = useState(false);
  const [otp, SetOtp] = useState("");
  const [responseData, setResponseData] = useState({
    userid: "",
    otp: "",
  });

  const OTP_SENDER =
    "https://asrlabs.asrhospitalindia.in/lims/authentication/signin";

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    SetLoginClicked(true);
    try {
      const response = await axios.post(OTP_SENDER, loginData);
      toast.success("OTP sent to your email/phone.");
      setResponseData((prev) => ({
        ...prev,
        userid: response.data.id,
        otp: "",
      }));
      SetOtp(response.data.otp);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userid", response.data.id);
    } catch (err) {
      console.error("Login error", err);
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
      console.error("OTP verification error", err);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-poppins">
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: { background: "#d1fae5", color: "#065f46" },
          },
          error: {
            style: { background: "#fee2e2", color: "#991b1b" },
          },
        }}
      />

      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-xl p-8">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
          Login
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
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100"
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
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginClicked}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md font-medium hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {otp && (
          <p className="text-center mt-4 text-green-600 text-base">
            <strong>Debug OTP:</strong> {otp}
          </p>
        )}

        {loginClicked && (
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
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-600 text-white mt-4 py-2 rounded-md hover:bg-green-700 transition"
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
