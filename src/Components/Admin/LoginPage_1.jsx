import  { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
    "https://asrlabs.asrhospitalindia.in/lims/authentication/signin" ||
    "http://localhost:3000";
    
  const OTP_VERIFIER =
    "https://asrlabs.asrhospitalindia.in/lims/authentication/verifyotp" ||
    "http://localhost:3000";

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
      console.log(response.data);
      // setResponseData((prev) => ({ ...prev, userid: response.data.id }));
      // Store userid and clear OTP input field
      setResponseData((prev) => ({
        ...prev,
        userid: response.data.id,
        otp: "", 
      }));

      // Optional: For dev-only testing — store the OTP to display (for display only)
      SetOtp(response.data.otp); // assuming backend sends otp in response

      

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
    console.log(payload);
    try {
      const response = await axios.post(
        "https://asrlabs.asrhospitalindia.in/lims/authentication/verifyotp",
        payload
      );
      toast.success("OTP verified! Redirecting...");
      console.log(response.data);
      localStorage.setItem("authToken", response.data.token);
      window.location.reload();
    } catch (err) {
      console.error("OTP verification error", err);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFYqoKTu_o3Zns2yExbst2Co84Gpc2Q1RJbA&s)",
        fontFamily: "'Mukta', sans-serif",
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: { background: "#4ade80", color: "#1f2937" },
          },
          error: {
            style: { background: "#f87171", color: "#1f2937" },
          },
        }}
      />

        


      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">LOGIN</h2>

        


        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginData.username}
              onChange={handleLoginChange}
              required
              disabled={loginClicked}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
              disabled={loginClicked}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loginClicked}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* For dev-only testing — store the OTP to display (for display only) */}
        {otp && (
          <p className="text-center mt-4 text-sm text-green-600 text-xl">
            <strong>Debug OTP:</strong> {otp}
          </p>
        )}

        {loginClicked && (
          <div className="mt-6">
            <label className="block mb-1 font-medium">Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              onChange={(e) =>
                setResponseData((prev) => ({ ...prev, otp: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
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
