"use client";
import { useAuth } from "@/app/context/AuthContext";
import withAuth from "@/hoc/withAuth";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import { IoEye, IoEyeOff } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StaffProfile = () => {
  const { state } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [changePasswordData, setChangePasswordData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [imageChanged, setImageChanged] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [userData, setUserData] = useState<{
    first_name: string;
    second_name: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    zip_code: string;
    userfile: File | null;
    user_photo: string;
    user_name: string;
  }>({
    first_name: "",
    second_name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    zip_code: "",
    user_name: "",
    userfile: null,
    user_photo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/staff/member/my_profile", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();

      if (data.success) {
        setUserData(data.data || []);
      } else {
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [state]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("first_name", userData.first_name);
    formData.append("second_name", userData.second_name);
    formData.append("email", userData.email);
    formData.append("mobile", userData.mobile);
    formData.append("address", userData.address);
    formData.append("city", userData.city);
    formData.append("zip_code", userData.zip_code);

    if (userData.userfile) {
      formData.append("userfile", userData.userfile);
      console.log("FormData preview:");
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
    } else {
      console.log("No file provided for upload.");
    }

    console.log("submitting formdata", Object.fromEntries(formData.entries()));

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/staff/member/profile_update`, {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: formData,
      });

      const data = await response.json();

      console.log(data, "Backend update response");

      if (data.success) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
        fetchProfileData();
      } else {
        toast.error(data.msg || "Failed to update profile.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (err: any) {
      console.error("Error during API call:", err);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setChangePasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (
      !changePasswordData.new_password ||
      !changePasswordData.confirm_password
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }
    if (changePasswordData.new_password.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (
      changePasswordData.new_password !== changePasswordData.confirm_password
    ) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/staff/member/change_password", {
        method: "POST",
        headers: {
          Authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({
          new_password: changePasswordData.new_password,
          confirm_password: changePasswordData.confirm_password,
        }),
      });

      const result = await response.json();
      console.log(result, "changepassword");
      if (!response.ok) {
        toast.error(result.msg || "Failed to change password!");
      } else {
        toast.success("Password changed successfully!");
      }

      setSuccess(true);

      setChangePasswordData({
        new_password: "",
        confirm_password: "",
      });
    } catch (err: any) {
      toast.error("Error during password change!");
    } finally {
      setLoading(false);
    }
  };

  const showAccount = () => setActiveTab("account");
  const showSecurity = () => setActiveTab("security");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type. Please upload an image.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setUserData((prevData) => ({ ...prevData, userfile: file }));
      setImageChanged(true);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setUserData((prevData) => ({ ...prevData, userfile: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className=" w-full  pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6">
        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          Profile
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a
              className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent"
              href="#"
            >
              Admin
            </a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </li>
          <li> Profile</li>
        </ul>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center space-x-4">
              <div className="avatar size-14">
                <img
                  className="rounded-full"
                  src={` https://our-demos.com/n/drivingschool_api/assets/images/documents/${userData.user_photo}`}
                  alt="avatar"
                />
              </div>
              <div>
                <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
                  {/* Admin */}
                  {userData.user_name}
                </h3>
              </div>
            </div>
            {/* social icons */}
            <div>
              <div className="flex space-x-4 mt-2">
                <button className="btn size-8 m-1 rounded-full bg-primary/10 p-0 font-medium text-primary hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25">
                  <FaFacebookSquare className="size-4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </button>

                <div>
                  <h3 className="font-normal text-slate-700 line-clamp-1 dark:text-navy-100">
                    Facebook
                  </h3>

                  <p className="mt-0.5 text-xs line-clamp-1 text-primary">
                    <Link
                      href=""
                      onClick={() =>
                        window.open(`http://facebook.com`, "_blank")
                      }
                    >
                      http://facebook.com
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 mt-2">
                <button className="btn size-8 m-1 rounded-full bg-success/10 p-0 font-medium text-success hover:bg-success/20 focus:bg-success/20 active:bg-success/25">
                  <FaTwitter className="size-4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </button>
                <div>
                  <h3 className="font-normal text-slate-700 line-clamp-1 dark:text-navy-100">
                    Twitter
                  </h3>
                  <p className="mt-0.5 text-xs line-clamp-1 text-primary">
                    <Link
                      href=""
                      onClick={() =>
                        window.open(`https://www.twitter.com`, "_blank")
                      }
                    >
                      https://www.twitter.com/
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 mt-2">
                <button className="btn size-8 m-1 rounded-full bg-info/10 p-0 font-medium text-info hover:bg-info/20 focus:bg-info/20 active:bg-info/25">
                  <FaLinkedin className="size-4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </button>
                <div>
                  <h3 className="font-normal text-slate-700 line-clamp-1 dark:text-navy-100">
                    Linkedin
                  </h3>
                  <p className="mt-0.5 text-xs line-clamp-1 text-primary">
                    <Link
                      href=""
                      onClick={() =>
                        window.open(` https://www.linkedin.com/`, "_blank")
                      }
                    >
                      https://www.linkedin.com/
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex space-x-4 mt-2">
                <button className="btn size-8 m-1 rounded-full bg-secondary/10 p-0 font-medium text-secondary hover:bg-secondary/20 focus:bg-secondary/20 active:bg-secondary/25">
                  <FaInstagram className="size-4" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </button>
                <div>
                  <h3 className="font-normal text-slate-700 line-clamp-1 dark:text-navy-100">
                    Instagram
                  </h3>
                  <p className="mt-0.5 text-xs line-clamp-1 text-primary">
                    <Link
                      href=""
                      onClick={() =>
                        window.open(` https://www.instagram.com`, "_blank")
                      }
                    >
                      https://www.instagram.com/
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <ul className="mt-6 space-y-1.5 font-inter font-medium">
              <li>
                <button
                  onClick={showAccount}
                  className={`group flex w-full items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all ${
                    activeTab === "account"
                      ? "bg-primary text-white"
                      : "hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Account</span>
                </button>
              </li>
              <li>
                <button
                  onClick={showSecurity}
                  className={`group flex w-full items-center space-x-2 rounded-lg px-4 py-2.5 tracking-wide outline-none transition-all ${
                    activeTab === "security"
                      ? "bg-primary text-white"
                      : "hover:bg-slate-100 hover:text-slate-800 focus:bg-slate-100 focus:text-slate-800 dark:hover:bg-navy-600 dark:hover:text-navy-100 dark:focus:bg-navy-600 dark:focus:text-navy-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-slate-400 transition-colors group-hover:text-slate-500 group-focus:text-slate-500 dark:text-navy-300 dark:group-hover:text-navy-200 dark:group-focus:text-navy-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>Security</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <div className="card">
            {activeTab === "account" && (
              <form onSubmit={handleUpdate}>
                <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
                  <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                    Account Settings
                  </h2>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>First Name </span>
                      <span className="relative mt-1.5 flex">
                        <input
                          className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="User name"
                          type="text"
                          name="first_name"
                          value={userData.first_name}
                          onChange={handleInputChange}
                        />
                        <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                          <i className="fa-regular fa-user text-base" />
                        </span>
                      </span>
                    </label>
                    <label className="block">
                      <span>Last Name </span>
                      <span className="relative mt-1.5 flex">
                        <input
                          className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Enter name"
                          type="text"
                          name="second_name"
                          value={userData.second_name}
                          onChange={handleInputChange}
                        />
                        <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                          <i className="fa-regular fa-user text-base" />
                        </span>
                      </span>
                    </label>
                    <label className="block">
                      <span>Email Address </span>
                      <span className="relative mt-1.5 flex">
                        <input
                          className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Enter email address"
                          type="text"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                        />
                        <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                          <i className="fa-regular fa-envelope text-base" />
                        </span>
                      </span>
                    </label>
                    <label className="block">
                      <span>Phone Number</span>
                      <span className="relative mt-1.5 flex">
                        <input
                          className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Enter phone number"
                          type="text"
                          name="mobile"
                          value={userData.mobile}
                          onChange={handleInputChange}
                        />
                        <span className="pointer-events-none absolute flex h-full w-10 items-center justify-center text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent">
                          <i className="fa fa-phone" />
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="gap-4 sm:grid-cols-2">
                    <label className="block mt-2">
                      <span> Address </span>
                      <span className="relative mt-1.5 flex">
                        <textarea
                          rows={3}
                          placeholder=" "
                          name="address"
                          className="form-textarea mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-transparent p-2.5 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          value={userData.address}
                          onChange={handleInputChange}
                        />
                      </span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block mt-2">
                      <span>City </span>
                      <span className="relative mt-1.5 flex">
                        <input
                          className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder=""
                          type="text"
                          name="city"
                          value={userData.city}
                          onChange={handleInputChange}
                        />
                      </span>
                    </label>
                    <label className="block mt-2">
                      <span>Zipcode</span>
                      <span className="relative mt-1.5 flex">
                        <input
                          className="form-input peer w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder=""
                          type="text"
                          name="zip_code"
                          value={userData.zip_code}
                          onChange={handleInputChange}
                        />
                      </span>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 font-medium">User Photo</label>
                    <div className="w-32 h-32">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded border"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center border rounded">
                          <img
                            className="mask is-squircle"
                            src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${userData.user_photo}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {!profileImage && (
                    <div className="mb-4">
                      <label className="w-1/5 flex items-center justify-center border rounded p-2 cursor-pointer bg-blue-500 text-white">
                        Select Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                  {profileImage && (
                    <>
                      <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleRemoveImage}
                        className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                      >
                        Remove
                      </button>
                    </>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      className="btn min-w-[7rem] rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {loading ? "Updating..." : "Update"}
                    </button>
                  </div>
                  <div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
                </div>
              </form>
            )}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordChange}>
                <div className="flex flex-col items-center space-y-4 border-b border-slate-200 p-4 dark:border-navy-500 sm:flex-row sm:justify-between sm:space-y-0 sm:px-5">
                  <h2 className="text-lg font-medium tracking-wide text-slate-700 dark:text-navy-100">
                    Change password
                  </h2>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="mb-4">
                    <div className="relative">
                      <label className="block">New Password:</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="new_password"
                        className="form-input peer mt-1.5 w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Enter new password"
                        value={changePasswordData.new_password}
                        onChange={handlePasswordInputChange}
                        required
                      />
                      <span
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400 mt-4"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <IoEye /> : <IoEyeOff />}
                      </span>
                    </div>
                    <div className="relative">
                      <label className="block mt-1.5">
                        Confirm New Password:
                      </label>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        className="form-input peer mt-1.5 w-full rounded-full border border-slate-300 bg-transparent px-3 py-2 pl-9 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Confirm new password"
                        value={changePasswordData.confirm_password}
                        onChange={handlePasswordInputChange}
                        required
                      />
                      <span
                        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400 mt-4"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
                      </span>
                    </div>
                    {message && (
                      <p className="text-sm text-red-600">{message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      className="btn min-w-[7rem] w-full rounded-full bg-primary font-medium text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {loading ? "Updating Password..." : "Update Password"}
                    </button>
                  </div>
                  <div className="my-7 h-px bg-slate-200 dark:bg-navy-500" />
                </div>
              </form>
            )}
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              style={{
                width: "100%",
                padding: "0 20px",
              }}
              toastStyle={{
                width: "100%",
                marginBottom: "10px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// export default AdminProfile;
export default withAuth(StaffProfile, ["staff"]);
//only users with staff role and a valid token can access this page