import { useAuth } from "@/app/context/AuthContext";
import { useState, useEffect } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Vehicle {
  id: number;
  enc_id : string;
  vehicle_no: string;
  status: string;
  tax_expiry_date: string;
  rc_expiry_date: string;
  pucc_expiry_date: string;
  insurance_expiry_date: string;
  userfile: File | null;
  rc_document: string | File;
  text: string;
}
interface EditProps {
  showModal: boolean;
  toggleModal: () => void;
  vehicleData: Vehicle | null;
  onSave: (updatedDriver: Vehicle) => void;
}

const Edit = ({ showModal, toggleModal, vehicleData, onSave }: EditProps) => {

  const { state } = useAuth();

 // console.log("single vehicle data" , vehicleData);
  

  const [formData, setFormData] = useState<Vehicle | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    if (vehicleData) {
      setFormData(vehicleData);     
    }
  }, [vehicleData]);
  //   console.log("formData" , formData);
      

  useEffect(() => {
    if (formData?.userfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(formData.userfile);
    }
  }, [formData?.userfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData((prevData) =>
        prevData ? { ...prevData, userfile: file } : null
      );
      setImageChanged(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!formData?.vehicle_no) {
      setError("Vehicle number is required.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", formData.id.toString());
      formDataToSend.append("vehicle_no", formData.vehicle_no);
      formDataToSend.append("tax_expiry_date", formData.tax_expiry_date);
      formDataToSend.append("rc_expiry_date", formData.rc_expiry_date);
      formDataToSend.append("pucc_expiry_date", formData.pucc_expiry_date);
      formDataToSend.append("insurance_expiry_date", formData.insurance_expiry_date);

      if (imageChanged && formData.userfile) {
        formDataToSend.append("user_photo", formData.userfile);
      } else if (typeof formData.rc_document === "string") {
        // Only fetch if rc_document is a valid URL
        const response = await fetch(formData.rc_document);
        const blob = await response.blob();
        const rcFile = new File([blob], "", { type: blob.type });
        formDataToSend.append("user_photo", rcFile);
      } else if (formData.rc_document instanceof File) {
        formDataToSend.append("user_photo", formData.rc_document);
      }

      console.log( "Submitting FormData:", Object.fromEntries(formDataToSend.entries()) );

      const response = await fetch(`/api/admin/settings/update_vehicle`, {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: formDataToSend,
      });

      const data = await response.json();
      console.log("API Response:", data);
     

      if (data.message.success === true) {
        toast.success(data.message.msg || "Vehicle updated successfully");  // "Vehicle updated successfully"
        setSuccess(true);
        onSave(formData);
        //toggleModal();
      } else {
        setError("Failed to update vehicle");
        toast.error(data.msg || "failed to update vehicle");
      }
    } catch (err: any) {
      // setError('An error occurred while updating the vehicle.');
      toast.error( err.message || "An error occurred while updating the vehicle." );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData((prevData) =>
      prevData ? { ...prevData, userfile: null } : null
    ); // Clear the image file from formData
  };

  if (!showModal || !formData) return null;
  const today = new Date().toISOString().split("T")[0];

  
  return (
    <div>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        role="dialog"
        onKeyDown={(e) => e.key === "Escape" && toggleModal()}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300"
          onClick={toggleModal}
        ></div>

        <div className="relative flex w-full max-w-3xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
          <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
            <h3 className="text-xl font-medium text-slate-700 dark:text-navy-100">
              Edit Vehicle
            </h3>
            <button
              onClick={toggleModal}
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
                <span>Vehicle Number</span>
                <span className="relative mt-1.5 flex">
                  <input
                    type="text"
                    name="vehicle_no"
                    value={formData.vehicle_no}
                    onChange={handleChange}
                    placeholder="Vehicle No:"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
              <label className="block">
                <span>Tax Expiry Date </span>
                <span className="relative mt-1.5 flex">
                  <input
                    type="date"
                    name="tax_expiry_date"
                    value={formData.tax_expiry_date}
                    onChange={handleChange}
                    min={today}
                    placeholder="Mobile"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>

              <label className="block">
                <span>RC Expiry Date </span>
                <span className="relative mt-1.5 flex">
                  <input
                    type="date"
                    name="rc_expiry_date"
                    value={formData.rc_expiry_date}
                    onChange={handleChange}
                    min={today}
                    placeholder="Mobile"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
              <label className="block">
                <span>PUCC Expiry Date</span>
                <span className="relative mt-1.5 flex">
                  <input
                    type="date"
                    name="pucc_expiry_date"
                    value={formData.pucc_expiry_date}
                    onChange={handleChange}
                    min={today}
                    placeholder="Mobile"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>
              <label className="block">
                <span>Insurance Expiry Date</span>
                <span className="relative mt-1.5 flex">
                  <input
                    type="date"
                    name="insurance_expiry_date"
                    value={formData.insurance_expiry_date}
                    onChange={handleChange}
                    min={today}
                    placeholder="Mobile"
                    className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                  />
                </span>
              </label>

              <div className="ml-2">
                <span className="mb-2">RC Upload</span>
                {imagePreview ? (
                  // If an image is selected, show the preview
                  <div className="mb-2">
                    <img
                      src={imagePreview}
                      alt="Selected"
                      className="w-36 h-32 object-cover border rounded"
                    />
                  </div>
                ) : (
                  // If no image is selected, show the default rc_document image
                  <div className="mb-2">
                    <img
                      src={`https://our-demos.com/n/drivingschool_api/assets/images/rc_documents/${formData.rc_document}`}
                      alt="RC Document"
                      className="w-36 h-32 object-cover border rounded"
                    />
                  </div>
                )}

                {!imagePreview && (
                  <label className="w-1/3 flex items-center justify-center rounded p-2 cursor-pointer bg-primary hover:bg-primary-focus text-white">
                    Select Image
                    <input
                      type="file"
                      name="userfile"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}

                {imagePreview && (
                  <div className="mt-2">
                    <label
                      className="bg-primary text-white p-2 rounded cursor-pointer px-6"
                      htmlFor="imageUpload"
                    >
                      Change
                    </label>
                    <input
                      id="imageUpload"
                      type="file"
                      name="userfile"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                      // className="hidden"
                    />

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="outline-dark border-[1px] border-dark font-bold py-1.5 px-4 rounded ml-3"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-1/5"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Edit;
