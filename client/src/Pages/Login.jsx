import React, { useState } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Loader2 } from "lucide-react";

const Login = () => {
  const { isLogging, Login } = useAuthStore();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4  ">
      <div className="card w-full max-w-md shadow-xl bg-base-100 overflow-hidden">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Email Input */}
            <div className="form-control w-full">
              <label htmlFor="email" className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-control w-full">
              <label htmlFor="password" className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="mt-2">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLogging}
              >
                {isLogging ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p className="text-center mt-4 text-sm text-base-content">
            Don&apos;t have an account?{" "}
            <a href="/register" className="link link-primary">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
