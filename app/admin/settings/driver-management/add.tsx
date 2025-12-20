import { useAuth } from "@/app/context/AuthContext";
import withAuth from "@/hoc/withAuth";
import React, { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CreateProps = {
  showModal: boolean;
  togglemodal: () => void;
};

const Add: React.FC<CreateProps> = ({ showModal, togglemodal }) => {

  const { state } = useAuth();


  const [driverName, setDriverName] = useState("");
  const [mobile, setMobile] = useState("");
  const [place, setPlace] = useState("");
  const [drivingLicenceNo, setdrivingLicenceNo] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (!showModal) return null;


  // submit function
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!driverName || !mobile || !place || !drivingLicenceNo) {
      setError("All fields are required");
      return;
    }
    if (!/^\d+$/.test(mobile)) {
      setError("Mobile number must be numeric.");
      return;
    }
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      setError("Mobile number must be a valid 10-digit number.");
      return;
    }
    if (/\s/.test(password)) {
      setError("Password should not contain spaces.");
      return;
    }
    if (!password || password.length < 6) {
      setError("password must be at least 6 characters long");
      return;
    }


    setError("");
    setLoading(true);
    setSuccess(false);



    const formData = {
      driver_name: driverName,
      mobile,
      place: place,
      driving_licence_no: drivingLicenceNo,
      password,
    };

    try {
      const response = await fetch("/api/admin/settings/add_driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 409) {
          const mobileError = errorData?.messages?.errors?.mobile;

          if (mobileError) {
            toast.error(mobileError);
            setError(mobileError);
            setLoading(false);
            return;
          }
        }

        toast.error(errorData?.messages?.message ?? "Something went wrong");
        throw new Error(errorData?.messages?.message ?? "Unknown error");
      }

      const data = await response.json();

      if (data.message.success === true) {
        toast.success(data.message.msg);
        setSuccess(true);
      } else {
        toast.error(data.messages.message);
      }

      // Clear form fields
      setDriverName("");
      setMobile("");
      setPlace("");
      setdrivingLicenceNo("");
      setPassword("");
      setTimeout(() => togglemodal(), 2000);

    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog"
        onKeyDown={(e) => e.key === "Escape" && togglemodal()}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={togglemodal}
        ></div>

        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Add Driver
            </h3>
            <button
              onClick={togglemodal}
              className="btn -mr-1.5 size-7 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span>Driver Name </span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Name"
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                  />
                </span>
              </label>
              <label className="block">
                <span>Mobile </span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Mobile No"
                    type="text" // Change to text to avoid spinner
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers
                      if (/^\d*$/.test(value) || value === '') {
                        setMobile(value);
                      }
                    }}
                    onKeyPress={(e) => {
                      // Allow only numbers and backspace
                      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                        e.preventDefault();
                      }
                    }}
                  />
                </span>
              </label>

              <label className="block">
                <span>Place </span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Place"
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                  />

                </span>
              </label>


              <label className="block">
                <span>Driving Licence No</span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Enter Driving Licence No"
                    type="text"
                    value={drivingLicenceNo}
                    onChange={(e) => setdrivingLicenceNo(e.target.value)}
                  />
                </span>
              </label>
              {/* <label className="relative flex mt-4"> */}
              <label className="block">
                <span>Password</span>
                <span className="relative mt-1 flex">
                  <input
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    //  onChange={(e) => setPassword(e.target.value)}
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/\s/g, ""); // Remove spaces
                      setPassword(newValue);
                    }}

                  />
                  <span
                    className="absolute right-4 flex items-center justify-center text-slate-400 hover:text-primary dark:text-navy-400 dark:hover:text-accent cursor-pointer mt-3"
                    onClick={togglePasswordVisibility}
                  >
                    {/* {showPassword ? <IoEye /> : <IoEyeOff />} */}
                    {showPassword ? <HiEye size={16} /> : <HiEyeOff size={16} />}

                  </span>
                </span>
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
            <button
              type="submit"
              className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5 mt-4"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// export default Add;
export default withAuth(Add, ["admin"]); // this from hoc
//only users with the admin role and valid token can acess this page
