import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Textbox from "../../components/Textbox";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slice/authSlice";
import { toast } from "sonner";
import Loading from "../../components/Loader";
import { useRegisterUserMutation } from "../../redux/slice/app/authApiSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const selectedRole = watch("role", "user");

  const submitHandler = async (data) => {
    try {
      const payload = {
        ...data,
        isAdmin: selectedRole === "admin",
      };

      const result = await registerUser(payload).unwrap();
      dispatch(setCredentials(result));
      navigate("/login");
      toast.success("User Registered Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a3c] to-[#1a1a5e] p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center shadow-xl backdrop-blur-lg bg-white/10 rounded-xl p-6 sm:p-8 border border-white/20">
        {/* Left panel */}
        <div className="hidden md:flex flex-col items-center text-center text-white w-1/2 p-4">
          <p className="text-sm sm:text-lg border border-gray-300 rounded-full px-3 py-1">
            Join us & manage tasks effortlessly!
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold mt-4 bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
            Zidio Task Manager
          </h1>
        </div>

        {/* Signup Form */}
        <div className="w-full md:w-1/2 p-4 sm:p-6">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-white">
              Create an Account
            </h2>
            <p className="text-center text-gray-300 text-xs sm:text-sm">
              Your credentials are encrypted & secure.
            </p>

            {/* Full Name */}
            <Textbox
              placeholder="John Doe"
              type="text"
              name="name"
              label="Full Name"
              labelClassName="text-white"
              className="w-full rounded-lg text-white"
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name?.message}
            />

            {/* Email */}
            <Textbox
              placeholder="email@example.com"
              type="email"
              name="email"
              label="Email Address"
              labelClassName="text-blue-300"
              className="w-full rounded-lg text-white"
              register={register("email", { required: "Email is required!" })}
              error={errors.email?.message}
              autoComplete="email"
            />

            {/* Password */}
            <div className="relative w-full">
              <Textbox
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                labelClassName="text-white"
                className="w-full rounded-lg text-white"
                register={register("password", {
                  required: "Password is required!",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/,
                    message: "Must include letters & numbers",
                  },
                })}
                error={errors.password?.message}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative w-full">
              <Textbox
                placeholder="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                label="Confirm Password"
                labelClassName="text-blue-300"
                className="w-full rounded-lg text-white"
                register={register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match!",
                })}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-10 text-gray-400 hover:text-white"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? (
                  <IoEyeOffOutline size={20} />
                ) : (
                  <IoEyeOutline size={20} />
                )}
              </button>
            </div>

            {/* Role Radio Buttons */}
            <div className="text-white">
              <label className="block mb-1 font-semibold">Role</label>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="user"
                    {...register("role", { required: "Please select a role" })}
                    className="text-blue-500"
                  />
                  <span>User</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="admin"
                    {...register("role", { required: "Please select a role" })}
                    className="text-blue-500"
                  />
                  <span>Admin</span>
                </label>
              </div>

              {errors.role && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center space-x-2 text-gray-300 text-xs sm:text-sm">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "You must accept the terms!",
                })}
                className="w-4 h-4 accent-blue-400 cursor-pointer"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="/terms" className="text-blue-300 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-400 text-xs">{errors.terms.message}</p>
            )}

            {/* Submit Button */}
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                label="Sign Up"
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-400 text-white uppercase rounded-lg hover:shadow-lg transition duration-300"
              />
            )}

            <div className="text-center text-white text-xl mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-300 hover:underline">
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
