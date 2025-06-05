import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OtpField from "react-otp-field";
import {
  useVerifyEmailMutation,
  useResendOtpMutation,
} from "../../redux/slice/app/authApiSlice";
import { toast } from "sonner";
export default function EmailVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resendOtp] = useResendOtpMutation();

  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const handleVerifyOtp = async () => {
    try {
      if (!userId) return alert("User ID missing");

      const res = await verifyEmail({ userId, OTP: otp }).unwrap();
      console.log(res)
      if (res?.isActive) {
        toast.success(res.message);
        navigate("/dashboard");
      } else {
        alert(res.message || "OTP verification failed.");
      }
    } catch (err) {
      alert(err?.data?.message || "Failed to verify OTP.");
    }
  };

  // Optional: Call this manually if needed
  const handleResendOtp = async () => {
    try {
      if (!userId) return alert("User ID missing");

      const res = await resendOtp({ userId }).unwrap();
      alert(res.message);
    } catch (err) {
      alert(err?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Enter OTP
        </h2>

        <OtpField
          value={otp}
          onChange={setOtp}
          numInputs={6}
          className="flex justify-center gap-3 mb-6"
          inputProps={{
            className:
              "w-10 h-12 text-xl text-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg outline-none focus:ring-2 ring-blue-500",
          }}
        />

        <button
          onClick={handleVerifyOtp}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition"
        >
          Verify OTP
        </button>

        {/* 🔒 Not showing resend button, only call manually or conditionally  */}
        
        <button
          onClick={handleResendOtp}
          className="mt-4 text-sm text-blue-500 hover:underline"
        >
          Resend OTP
        </button>
       
      </div>
    </div>
  );
}
