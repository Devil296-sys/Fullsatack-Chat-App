import React, { useState } from "react";
import { useAuthStore } from "../Store/AuthStore";
import { Loader2 } from "lucide-react";

const Register = () => {
  const { isRegistering, Register } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Register(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl text-center">
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="form-control w-full">
              <label htmlFor="fullName" className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Bob Doe"
                className="input input-bordered w-full"
                required
              />
            </div>
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
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p className="text-center mt-4 text-sm text-base-content">
            Already Have an Account ?{" "}
            <a href="/login" className="link link-primary">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
