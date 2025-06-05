// src/components/ForgetPassword.jsx
import React, { useState } from 'react';
import { useSendResetPasswordMutation, useResetPasswordMutation } from '../../redux/slice/app/authApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); 
  const navigate = useNavigate()

  const [sendResetPassword, { isLoading: isSending }] = useSendResetPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleRequestOTP = async () => {
    try {
      const response = await sendResetPassword(email).unwrap();
      if (response.success) {
        toast.success(response.message);
        setStep(2); // Move to the next step to enter OTP and new password
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await resetPassword({ email, OTP, newPassword }).unwrap();
      if (response.success) {
        toast.success(response.message);
        setStep(1); 
        navigate('/')
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-6">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Forget Password</h2>

        {step === 1 && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Enter your email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleRequestOTP}
              disabled={isSending || !email}
              className="w-full py-3 mt-4 rounded-md bg-blue-600 text-white text-lg disabled:bg-blue-400"
            >
              {isSending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              id="otp"
              placeholder="OTP"
              className="w-full p-3 mb-4 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
            />
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">Enter new password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              className="w-full p-3 mb-4 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              disabled={isResetting || !OTP || !newPassword}
              className="w-full py-3 mt-4 rounded-md bg-green-600 text-white text-lg disabled:bg-green-400"
            >
              {isResetting ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
