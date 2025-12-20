



"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    address: string;
    gender: string;
    phone_no: string;
    role: string;
    amount: string;
    class: string;
    type: string[];
    no_of_days: string;
    password: string;
    confirmPassword: string;
    save: string;
  }>({
    name: "",
    email: "",
    address: "",
    gender: "",
    phone_no: "",
    role: "",
    amount: "",
    class: "",
    type: [],
    no_of_days: "",
    password: "",
    confirmPassword: "",
    save: "submit",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const { checked } = e.target;

      if (name === "type") {
        setFormData((prevData) => ({
          ...prevData,
          type: checked
            ? [...prevData.type, value]
            : prevData.type.filter((item) => item !== value),
        }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();


    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      console.log("Submitting signup data...", formData);


      const response = await fetch("/api/home/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address,
          gender: formData.gender,
          phone_no: formData.phone_no,
          role: formData.role,
          amount: formData.amount,
          class_days: formData.class,
          class_type: formData.type,
          no_of_days: formData.no_of_days,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          save: "submit"
        }),
      });



      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Signup failed");
        return;
      }





      const data = await response.json();
      console.log("Signup successful:", data);

      alert("Signup successful! Redirecting to login...");

      router.push("/login")
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong during signup. Please try again.");
    }
  };



  return (
    <>
      <link rel="stylesheet" href="/css/base.css" />
      <link rel="stylesheet" href="/dist/css/app.css" />
      <main className="grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">

          <div className="text-center">
            <img
              className="mx-auto size-16"
              src="/logo.png"             
              alt="logo"
            />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-navy-100">
                Welcome To Driving School
              </h2>
              {/* <p className="text-slate-400 dark:text-navy-300">
                Please sign up to continue
             
              </p> */}
            </div>
          </div>
          <div className="card mt-5 rounded-lg p-5 lg:p-7">
            {/* Role */}
            <label className="relative flex mt-4">
              <select
                name="role"
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Choose Role</option>
                <option value="driver">Driver</option>
                <option value="staff">Staff</option>
                <option value="student">Student</option>
              </select>
            </label>

            {/* Name */}
            <label className="relative flex mt-4">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                placeholder="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </label>

            {/* Email */}
            <label className="relative flex mt-4">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>

            {/* Address */}
            <label className="relative flex mt-4">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                placeholder="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            {/* Phone */}
            <label className="relative flex mt-4">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                placeholder="Phone"
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
              />
            </label>


            {/* Student-Specific Fields */}
            {formData.role === "student" && (
              <>
                {/* Class */}
                <label className="relative flex mt-4">
                  <select
                    name="class"
                    className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                    value={formData.class}
                    onChange={handleChange}
                  >
                    <option value="">Choose Class</option>
                    <option value="hours">Hourly</option>
                    <option value="days">Daily</option>
                  </select>
                </label>

                {/* Hours or Days */}
                {formData.class === "hours" && (
                  <label className="relative flex mt-4">
                    <input
                      type="number"
                      name="no_of_days"
                      placeholder="Enter hours"
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                      value={formData.no_of_days}
                      onChange={handleChange}
                    />
                  </label>
                )}
                {formData.class === "days" && (
                  <label className="relative flex mt-4">
                    <input
                      type="number"
                      name="no_of_days"
                      placeholder="Enter days"
                      className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                      value={formData.no_of_days}
                      onChange={handleChange}
                    />
                  </label>
                )}

                <div className="relative flex flex-col mt-4">
                  <p className="mb-2">Type:</p>
                  {["Two Wheeler", "Four Wheeler", "Heavy"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 mb-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="type"
                        value={type}
                        checked={formData.type.includes(type)}
                        onChange={handleChange}
                        className="h-4 w-4 border-gray-300 rounded focus:ring-2 focus:ring-primary-blue"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>

                {/* Gender */}
                <label className="relative flex mt-4">
                  <select
                    name="gender"
                    className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>

                {/* Amount */}
                <label className="relative flex mt-4">
                  <input
                    type="text"
                    name="amount"
                    placeholder="Enter Amount"
                    className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </label>
              </>
            )}

            {/* Password */}
            <label className="relative flex mt-4">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 flex items-center justify-center text-slate-400 cursor-pointer mt-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </span>
            </label>

            {/* Confirm Password */}
            <label className="relative flex mt-4">
              <input
                className="form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70"
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 flex items-center justify-center text-slate-400 cursor-pointer mt-3"
                onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
              </span>
            </label>

            {/* Submit Button */}
            <button
              className="btn mt-5 w-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus"
              type="submit"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
          </div>
          <div className="mt-4 text-center text-xs+">
            <p className="line-clamp-1">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="text-primary hover:text-primary-focus"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Signup;