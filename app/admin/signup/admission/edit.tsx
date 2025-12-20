
'use client'
import { useAuth } from "@/app/context/AuthContext";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

interface Admission {

  id?: string;
  admissionNo: string;
  applicationNo: string;
  name: string;
  mobile: string;
  dob: string;
  address: string;
  dlNo: string;
  bloodGroup: string;
  gender: string;
  branchId: string;
  userPhoto?: File | null;
  signature?: File | null;
  documents: Document[];

  serviceId: string;
  billNo: string;
  licenceNumber: string;
  vehicleNumber: string;
  renewalDate: string;
  returnDate: string;        // new field
  paymentMethod: string;
  totalAmount: number;
  discount: number;
  payAmount: number;
  payingAmount: number;
  remarks: string;

}

interface Document {
  type: string;
  file: File | null | string;
}

interface EditProps {
  showmodal: boolean;
  togglemodal: () => void;
  AdmissionData: Admission | null;
  onSave: (updatedAdmission: Admission) => void;
  onAdmissionUpdated?: () => void;
}

interface Branch {
  id: string;
  text: string;
}

interface Service {
  id: string;
  text: string;
}

const Edit = ({ showmodal, togglemodal, AdmissionData, onSave, onAdmissionUpdated }: EditProps) => {
  const { state } = useAuth();

  // Form data state
  const [formData, setFormData] = useState<Admission | null>({

    admissionNo: "",
    applicationNo: "",
    name: "",
    mobile: "",
    dob: "",
    address: "",
    dlNo: "",
    bloodGroup: "",
    gender: "",
    branchId: "",
    userPhoto: null,
    signature: null,
    documents: [
      { type: "", file: null },
      { type: "", file: null }
    ],


    serviceId: "",
    billNo: "",
    licenceNumber: "",
    vehicleNumber: "",
    renewalDate: "",
    returnDate: "",
    paymentMethod: "",
    totalAmount: 0,
    discount: 0,
    payAmount: 0,
    payingAmount: 0,
    remarks: ""

  });

  // Data states
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Search and filter states
  const [searchBranch, setSearchBranch] = useState("");
  const [searchService, setSearchService] = useState("");
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Selected values
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(Number);

  // Dropdown states
  const [isbranchDropdownOpen, setIsbranchDropdownOpen] = useState(false);
  const [isserviceDropdownOpen, setIsserviceDropdownOpen] = useState(false);

  // Image preview states
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const [doc1Preview, setdoc1Preview] = useState<string | null>(null)
  const [doc2Preview, setdoc2Preview] = useState<string | null>(null)

  // Loading state
  const [loading, setLoading] = useState(false);

  // Refs
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsbranchDropdownOpen(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target as Node)) {
        setIsserviceDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // Load admission data when component mounts
  useEffect(() => {
    if (AdmissionData) {

      console.log('single data full', AdmissionData);


      setFormData(AdmissionData);
      // setSelectedBranch(AdmissionData.branchId || "");
      // setSelectedService(AdmissionData.serviceId || "");
      // setSelectedAmount(AdmissionData.totalAmount  );
    }
  }, [AdmissionData]);


// if the above useEffect gives documents in corrupted format use this

  // useEffect(() => {
  //   if (AdmissionData) {
  //     console.log('AdmissionData documents:', AdmissionData.documents);

  //     // Handle the corrupted documents array
  //     let validDocuments: Document[] = [];

  //     if (AdmissionData.documents && Array.isArray(AdmissionData.documents)) {
  //       // Check if it's the corrupted format (has string characters after index 1)
  //       if (AdmissionData.documents.length > 2 && typeof AdmissionData.documents[2] === 'string') {
  //         // This is the corrupted format
  //         console.log('Detected corrupted documents format');

  //         // Extract document objects from first 2 positions
  //         const doc1 = AdmissionData.documents[0] || { type: "", file: null };
  //         const doc2 = AdmissionData.documents[1] || { type: "", file: null };

  //         // The rest might be a filename - try to reconstruct it
  //         const possibleFilename = AdmissionData.documents.slice(2).join('');
  //         console.log('Possible filename from corrupted data:', possibleFilename);

  //         validDocuments = [
  //           {
  //             type: doc1.type || "",
  //             file: doc1.file || null
  //           },
  //           {
  //             type: doc2.type || "",
  //             file: doc2.file || null
  //           }
  //         ];
  //       } else {
  //         // Normal format - filter valid documents
  //         validDocuments = AdmissionData.documents
  //           .filter(doc => doc && (doc.type || doc.file))
  //           .slice(0, 2);
  //       }
  //     }

  //     // Ensure we have exactly 2 documents for the form
  //     const documents = [
  //       ...validDocuments,
  //       ...Array(Math.max(0, 2 - validDocuments.length)).fill({ type: "", file: null })
  //     ].slice(0, 2);

  //     setFormData({
  //       ...AdmissionData,
  //       documents: documents
  //     });
  //   }
  // }, [AdmissionData]);

// end



// Handle form input changes 
  const handleChange = (field: keyof Admission, value: string | number | File | null) => {

    setFormData(prev => prev ? { ...prev, [field]: value } : null);

  }


  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);


  // Fetch branches and services
  const fetchInitialData = async () => {

    try {

      // Fetch branches
      const branchesResponse = await fetch("/api/admin/report/get_branch_autocomplete", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({}),
      });
      const branchesData = await branchesResponse.json();
      console.log('brach api', branchesData);

      setBranches(branchesData.data?.branch_details || []);
      setFilteredBranches(branchesData.data?.branch_details || []);



      // Fetch services
      const servicesResponse = await fetch("/api/admin/report/get_service_autocomplete", {
        method: "POST",
        headers: {
          authorizations: state?.accessToken ?? "",
          api_key: "10f052463f485938d04ac7300de7ec2b",
        },
        body: JSON.stringify({}),
      });
      const servicesData = await servicesResponse.json();
      setServices(servicesData.data?.service_details || []);
      setFilteredServices(servicesData.data?.service_details || []);

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load data");
    }
  };

  // Filter branches based on search
  useEffect(() => {
    if (searchBranch) {
      const filtered = branches.filter(branch => branch.text.toLowerCase().includes(searchBranch.toLowerCase()));
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(branches);
    }
  }, [searchBranch, branches]);


  // Handle branch selection
  const handleSelectBranch = (branch: Branch) => {
    // setSelectedBranch(branch.text);
    setFormData(prev => prev ? { ...prev, branchId: branch.text || " " } : null);
    setSearchBranch("");
    setIsbranchDropdownOpen(false);
  };



  // Filter services based on search
  useEffect(() => {
    if (searchService) {
      const filtered = services.filter(service => service.text.toLowerCase().includes(searchService.toLowerCase()));
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchService, services]);


  // Handle service selection
  const handleSelectService = (service: Service) => {

    // setSelectedService(service.text);

    setFormData(prev => prev ? { ...prev, serviceId: service.text || "" } : null);

    setSearchService("");
    setIsserviceDropdownOpen(false);
  };





  // File upload handlers - common for photo , signature
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Admission, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {

    const file = e.target.files?.[0];  // Get the first selected file
    console.log("file", file);

    if (file) {
      const reader = new FileReader();   // Create FileReader to read file content
      reader.onload = () => {
        setPreview(reader.result as string);   // Set preview with file data URL , // This is equivalent to: setUserPreview(reader.result as string) for userphoto

        if (setPreview == setUserPreview) {
          console.log("user preview", userPreview);
        }
        else {
          console.log("signature preview", signaturePreview);
        }

      };
      reader.readAsDataURL(file);        // Read file as data URL (base64)
      setFormData((prevData) => (prevData ? { ...prevData, [field]: file } : null));
    }

  };


  // Remove file handlers - common for photo , signature
  const removeFile = (field: keyof Admission, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    setPreview(null);
    setFormData((prevData) => (prevData ? { ...prevData, [field]: null } : null));
  };


  // document array - type changes
  const handleDocumentTypeChange = (index: number, value: string) => {

    setFormData(prev => {
      if (!prev) return null;  // If no previous data, return null

      const updatedDocuments = [...prev.documents];  // Create shallow copy of documents array
      updatedDocuments[index] = { ...updatedDocuments[index], type: value };   // Update specific document's type

      return { ...prev, documents: updatedDocuments };   // Return updated form data

    });

    if (index == 0) {
      console.log('type[0]', value);
    }
    else {
      console.log('type[1]', value);
    }
  };

  // For document file uploads
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {

    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);

        if (setPreview == setdoc1Preview) {
          console.log("doc1 preview", doc1Preview);
        }
        else {
          console.log("doc2 preview", doc2Preview);
        }

      };
      reader.readAsDataURL(file);

      setFormData(prev => {
        if (!prev) return null;

        const updatedDocuments = [...prev.documents];
        updatedDocuments[index] = { ...updatedDocuments[index], file: file };

        return { ...prev, documents: updatedDocuments };
      });
    }
  };


  // For document file removal
  const removeDocumentFile = (index: number, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {

    setPreview(null);

    setFormData(prev => {
      if (!prev) return null;

      const updatedDocuments = [...prev.documents];
      updatedDocuments[index] = { ...updatedDocuments[index], file: null };

      return { ...prev, documents: updatedDocuments };
    });
  };


  // edit submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("form data", formData);

    if (!formData) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append basic data
      //formDataToSend.append("update_service", (formData.id ?? "").toString());
      formDataToSend.append("admission_no", formData.admissionNo ?? "");
      formDataToSend.append("app_no", formData.applicationNo ?? "");
      formDataToSend.append("name", formData.name ?? "");
      formDataToSend.append("mobile", formData.mobile ?? "");
      formDataToSend.append("blood_group", formData.bloodGroup ?? "");
      formDataToSend.append("gender", formData.gender ?? "");
      formDataToSend.append("branch_id", formData.branchId ?? "");
      formDataToSend.append("address", formData.address ?? "");
      formDataToSend.append("dob", formData.dob ?? "");
      formDataToSend.append("dlNo", formData.dlNo ?? "");


      //file uploads
      // add file if they exist
      if (formData.userPhoto) {
        formDataToSend.append("userPhoto", formData.userPhoto)
      }
      if (formData.signature) {
        formDataToSend.append("signature", formData.signature)
      }

      // add documents array
      formData.documents.forEach((doc, index) => {
        formDataToSend.append(`documents[${index}][type]`, doc.type);

        if (doc.file) {
          formDataToSend.append(`documents[${index}][file]`, doc.file)
        }
      });

      //service info
      formDataToSend.append("serviceId", formData.serviceId) 
      formDataToSend.append("billNo", formData.billNo)
      formDataToSend.append("licenceNumber", formData.licenceNumber)
      formDataToSend.append("vehicleNumber", formData.vehicleNumber)
      formDataToSend.append("renewalDate", formData.renewalDate)
      formDataToSend.append("returnDate", formData.returnDate)     // new field
      formDataToSend.append("paymentMethod", formData.paymentMethod)
      formDataToSend.append("totalAmount", formData.totalAmount.toString())
      formDataToSend.append("discount", formData.discount.toString())
      formDataToSend.append("payAmount", formData.payAmount.toString())
      formDataToSend.append("payingAmount", formData.payingAmount.toString())
      formDataToSend.append("remarks", formData.remarks)

      console.log("submitted formdata :");

      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }


      




    } catch (error) {
      console.error('error', error);

    }


  }


  // Form submission
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!formData) return;

  //   setLoading(true);
  //   try {
  //     const formDataToSend = new FormData();

  //     // Append basic data
  //     //formDataToSend.append("update_service", (formData.id ?? "").toString());
  //     formDataToSend.append("admission_no", formData.admissionNo ?? "");
  //     formDataToSend.append("app_no", formData.applicationNo ?? "");
  //     formDataToSend.append("name", formData.name ?? "");
  //     formDataToSend.append("mobile", formData.mobile ?? "");
  //     formDataToSend.append("blood_group", formData.bloodGroup ?? "");
  //     formDataToSend.append("gender", formData.gender ?? "");
  //     formDataToSend.append("branch_id", formData.branchId ?? "");
  //     formDataToSend.append("address", formData.address ?? "");
  //     formDataToSend.append("dob", formData.dob ?? "");
  //     formDataToSend.append("dlNo", formData.dlNo ?? "");


  //     //file uploads
  //     // add file if they exist
  //     if (formData.userPhoto) {
  //       formDataToSend.append("userPhoto", formData.userPhoto)
  //     }
  //     if (formData.signature) {
  //       formDataToSend.append("signature", formData.signature)
  //     }

  //     // add documents array
  //     formData.documents.forEach((doc, index) => {
  //       formDataToSend.append(`documents[${index}][type]`, doc.type);

  //       if (doc.file) {
  //         formDataToSend.append(`documents[${index}][file]`, doc.file)
  //       }
  //     });

  //     //service info
  //     formDataToSend.append("serviceId", formData.serviceId)
  //     formDataToSend.append("billNo", formData.billNo)
  //     formDataToSend.append("licenceNumber", formData.licenceNumber)
  //     formDataToSend.append("vehicleNumber", formData.vehicleNumber)
  //     formDataToSend.append("paymentMethod", formData.paymentMethod)
  //     formDataToSend.append("totalAmount", formData.totalAmount.toString())
  //     formDataToSend.append("discount", formData.discount.toString())
  //     formDataToSend.append("payAmount", formData.payAmount.toString())
  //     formDataToSend.append("payingAmount", formData.payingAmount.toString())
  //     formDataToSend.append("remarks", formData.remarks)

  //     const response = await fetch(`/api/admin/signup/update_admission`, {
  //       method: "POST",
  //       headers: {
  //         authorizations: state?.accessToken ?? "",
  //         api_key: "10f052463f485938d04ac7300de7ec2b",
  //       },
  //       body: formDataToSend,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }

  //     const responseText = await response.text();
  //     let data;
  //     try {
  //       data = JSON.parse(responseText);
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       throw new Error("Invalid response from server");
  //     }

  //     if (response.ok && data?.success) {
  //       toast.success('Admission updated successfully');
  //       // refresh trigger part
  //       if (onAdmissionUpdated) {
  //         onAdmissionUpdated();
  //       }
  //       // close modal after success
  //       setTimeout(() => {
  //         togglemodal();
  //       }, 2000);
  //     } else {
  //       toast.error(`Failed to update: ${data?.msg || "Unknown error"}`);
  //     }
  //   } catch (err: any) {
  //     console.error("Error updating admission:", err);
  //     toast.error(err.message || 'An error occurred');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  if (!showmodal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5" role="dialog">
      <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-300" onClick={togglemodal}></div>

      <div className="relative flex w-full max-w-6xl origin-top flex-col overflow-hidden rounded-lg bg-white transition-all duration-300 dark:bg-navy-700">
        {/* Modal Header */}
        <div className="flex justify-between rounded-t-lg bg-slate-200 px-4 py-3 dark:bg-navy-800 sm:px-5">
          <h3 className="text-base font-medium text-slate-700 dark:text-navy-100">
            Edit Admission
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col sm:flex-row max-h-[80vh] overflow-y-auto px-4 py-4 sm:px-5 gap-8 hide-scrollbar">

            {/* Left Section - Profile Information */}
            <div className="flex-1 p-4">
              <div className="p-4 border border-gray-300 shadow-md rounded-lg">
                <label className="block mb-4 text-lg font-medium text-slate-700 dark:text-navy-100">
                  Profile Information
                </label>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Admission No</span>
                      <input
                        name="admission_no"
                        value={formData?.admissionNo || ""}
                        onChange={(e) => handleChange("admissionNo", e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Admission No"
                        type="text"
                      />
                    </label>

                    <label className="block">
                      <span>Application No </span>
                      <input
                        name="app_no"
                        value={formData?.applicationNo || ""}
                        onChange={(e) => handleChange("applicationNo", e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Application No"
                        type="text"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Name*</span>
                      <input
                        name="first_name"
                        value={formData?.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Name"
                        type="text"
                        required
                      />
                    </label>

                    <label className="block">
                      <span>Mobile*</span>
                      <input
                        name="mobile"
                        value={formData?.mobile || ""}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Mobile"
                        type="text"
                        required
                        onKeyPress={(e) => {
                          if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                            e.preventDefault();
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span>Date of Birth</span>
                      <input
                        name="dob"
                        value={formData?.dob || ""}
                        onChange={(e) => handleChange("dob", e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        type="date"
                      />
                    </label>

                    <label className="block">
                      <span>Address</span>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData?.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                        placeholder="Address"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <label className="block">
                      <span>DL No:</span>
                      <span className="relative mt-1 flex">
                        <input
                          value={formData?.dlNo || ""}
                          onChange={(e) => handleChange("dlNo", e.target.value)}
                          type="text" placeholder="Dl No" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />
                      </span>
                    </label>

                    <label className="block">
                      <span>Blood Group</span>
                      <select
                        name="blood_group"
                        value={formData?.bloodGroup || ""}
                        onChange={(e) => handleChange("bloodGroup", e.target.value)}
                        className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+ve</option>
                        <option value="O+">O+ve</option>
                        <option value="B+">B+ve</option>
                        <option value="AB+">AB+ve</option>
                        <option value="AB-">AB-ve</option>
                        <option value="B-">B-ve</option>
                        <option value="A-">A-ve</option>
                        <option value="O-">O-ve</option>
                      </select>
                    </label>

                    <label className="block">
                      <span>Gender</span>
                      <select
                        name="gender"
                        value={formData?.gender || ""}
                        onChange={(e) => handleChange("gender", e.target.value)}
                        className="text-sm pl-2 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                      </select>
                    </label>

                    {/* Branch Dropdown */}
                    <div className="relative w-full" ref={branchDropdownRef}>
                      <label className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                        Branch Name
                      </label>
                      <div
                        onClick={() => setIsbranchDropdownOpen(!isbranchDropdownOpen)}
                        className="mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      >
                        {formData?.branchId || "Select a branch"}
                        <span className="ml-2 dark:text-slate-400/70">
                          <FaChevronDown />
                        </span>
                      </div>

                      {isbranchDropdownOpen && (
                        <div className="absolute z-10 mt-1.5 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                          <input
                            type="text"
                            value={searchBranch}
                            onChange={(e) => setSearchBranch(e.target.value)}
                            placeholder="Search..."
                            className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                          />
                          <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                            {filteredBranches.length > 0 ? (
                              filteredBranches.map((branch) => (
                                <li
                                  key={branch.id}
                                  onClick={() => handleSelectBranch(branch)}
                                  className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                                >
                                  {branch.text}
                                </li>
                              ))
                            ) : (
                              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>



                  {/* File Upload Sections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">

                    {/* User Photo */}
                    <div>
                      <label className="block mb-2">User Photo</label>
                      <div className="border-2 rounded-lg flex items-center justify-center h-40 w-40 border-gray-400">

                        {userPreview ? (

                          <img src={userPreview} alt="User photo" className="max-h-full max-w-full object-contain" />

                        ) : (

                          <img
                            src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.userPhoto}`}
                            alt="user photo"
                            className="max-h-full max-w-full object-contain"
                          />
                        )}
                      </div>
                      <div className="mt-4 flex space-x-2">
                        {!userPreview ? (
                          <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                            Select Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'userPhoto', setUserPreview)}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <>
                            <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'userPhoto', setUserPreview)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeFile('userPhoto', setUserPreview)}
                              className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Signature */}
                    <div>
                      <label className="block mb-2">Signature</label>
                      <div className="border-2 rounded-lg flex items-center justify-center h-40 w-40 border-gray-400">

                        {signaturePreview ? (

                          <img src={signaturePreview} alt="Signature" className="max-h-full max-w-full object-contain" />
                        ) : (

                          <img
                            src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.signature}`}
                            alt="signature"
                            className="max-h-full max-w-full object-contain"
                          />
                        )}

                      </div>
                      <div className="mt-4 flex space-x-2">

                        {!signaturePreview ? (
                          <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                            Select Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, 'signature', setSignaturePreview)}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <>
                            <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                              Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'signature', setSignaturePreview)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeFile('signature', setSignaturePreview)}
                              className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded"
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Document Type */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">

                    {/* doc 1 */}
                    <div className="block">

                      <label className="block mt-2">
                        <span>Choose Document 1</span>
                        <span className="relative mt-1 flex">

                          <select
                            value={formData?.documents[0].type || ""}
                            onChange={(e) => handleDocumentTypeChange(0, e.target.value)}
                            className="text-sm pl-2 dark:bg-navy-700 form-select peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                            <option>Choose a Document </option>
                            <option value="sslc">SSLC</option>
                            <option value="aadhaar">Aadhaar</option>
                            <option value="birthcertificate">Birth Certificate</option>
                            <option value="passport">Passport</option>
                          </select>
                        </span>
                      </label>

                      <div>
                        <label className="block mb-2 mt-4">Document Proof</label>

                        <div className="border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-gray-400" >

                          {doc1Preview ?

                            <img src={doc1Preview} alt="doc1 image" className="max-h-full max-w-full object-contain" />
                            :

                            <img
                              src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.documents[0].file}`}
                              alt="doc1 image"
                              className="max-h-full max-w-full object-contain"
                            />

                          }

                        </div>

                        <div className="mt-4 flex space-x-2">

                          {!formData?.documents[0].file ?
                            (
                              <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                Select Image
                                <input type="file" accept="image/*" className="hidden"
                                  onChange={(e) => handleDocumentUpload(e, 0, setdoc1Preview)}
                                />
                              </label>
                            ) : (
                              <>
                                <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                  Change
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleDocumentUpload(e, 0, setdoc1Preview)}
                                    className="hidden"
                                  />
                                </label>

                                <button
                                  onChange={() => removeDocumentFile(0, setdoc1Preview)}
                                  className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded">
                                  Remove
                                </button>
                              </>
                            )}

                        </div>

                      </div>

                    </div>

                    {/* doc 2 */}

                    <div className="block">
                      <label className="block mt-2">
                        <span>Choose Document 2</span>

                        <span className="relative mt-1 flex">

                          <select
                            value={formData?.documents[1].type || ""}
                            onChange={(e) => handleDocumentTypeChange(1, e.target.value)}
                            className="text-sm pl-2 dark:bg-navy-700 form-select peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                            <option>Choose a Document</option>
                            <option value="sslc">SSLC</option>
                            <option value="aadhaar">Aadhaar</option>
                            <option value="birthcertificate">Birth Certificate</option>
                            <option value="passport">Passport</option>
                          </select>
                        </span>
                      </label>

                      <div>
                        <label className="block mb-2 mt-4">Document Proof</label>

                        <div className={doc2Preview ? "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-gray-400" : "border-2 rounded-lg flex items-center justify-center h-42 w-42 sm:h-40 sm:w-40 border-blue-500"}>

                          {doc2Preview ?
                            <img src={doc2Preview} alt="doc2 image" className="max-h-full max-w-full object-contain" />
                            :

                            <img
                              src={`https://our-demos.com/n/drivingschool_api/assets/images/documents/${formData?.documents[1].file}`}
                              alt="doc2 image"
                              className="max-h-full max-w-full object-contain"
                            />
                          }

                        </div>

                        <div className="mt-4 flex space-x-2">

                          {!formData?.documents[1].file ?
                            <label className="cursor-pointer bg-blue-700 hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                              Select Image
                              <input type="file" accept="image/*" className="hidden"
                                onChange={(e) => handleDocumentUpload(e, 1, setdoc2Preview)}
                              />
                            </label>
                            :
                            <>
                              <label className="cursor-pointer bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                                Change
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleDocumentUpload(e, 1, setdoc2Preview)}
                                  className="hidden"
                                />
                              </label>

                              <button
                                onChange={() => removeDocumentFile(1, setdoc2Preview)}
                                className="outline-dark border-[1px] border-dark font-bold py-2 px-4 rounded">
                                Remove
                              </button>

                            </>
                          }

                        </div>

                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Service Information */}
            <div className="flex-1 mt-4 sm:mt-0 p-4">
              <div className="p-4 border border-gray-300 shadow-md rounded-lg">
                <label className="block mb-4 text-lg font-medium text-slate-700 dark:text-navy-100">
                  Service Information
                </label>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    {/* Service Dropdown */}
                    <div className="relative w-full" ref={serviceDropdownRef}>
                      <label className="block text-sm text-[#64748B] dark:text-[#A3ADC2]">
                        Service
                      </label>
                      <div
                        onClick={() => setIsserviceDropdownOpen(!isserviceDropdownOpen)}
                        className="text-sm pl-2 mt-1 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm cursor-pointer focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                      >
                        {formData?.serviceId || "Select a service"}
                        <span className="ml-2 dark:text-slate-400/70">
                          <FaChevronDown />
                        </span>
                      </div>

                      {isserviceDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg dark:border-navy-600 dark:bg-navy-700">
                          <input
                            type="text"
                            value={searchService}
                            onChange={(e) => setSearchService(e.target.value)}
                            placeholder="Search..."
                            className="w-full border-b border-gray-300 px-3 py-2 text-sm focus:outline-none dark:border-navy-600 dark:bg-navy-700 dark:text-navy-100"
                          />
                          <ul className="max-h-48 overflow-y-auto hide-scrollbar">
                            {filteredServices.length > 0 ? (
                              filteredServices.map((service) => (
                                <li
                                  key={service.id}
                                  onClick={() => handleSelectService(service)}
                                  className="cursor-pointer px-3 py-2 hover:bg-indigo-500 hover:text-white dark:hover:bg-navy-500"
                                >
                                  {service.text}
                                </li>
                              ))
                            ) : (
                              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">No results found</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <label className="block">
                      <span>Bill No</span>
                      <input
                        name="billno"
                        value={formData?.billNo || ""}
                        onChange={(e) => handleChange("billNo", e.target.value)}
                        type="text"
                        placeholder="Bill no"
                        className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                      />
                    </label>
                  </div>

                  {/* licence number - if selected service == renewal to licence re entry */}

                  {(formData?.serviceId === 'Renewal Licence' || formData?.serviceId === 'Duplicate Licence' || formData?.serviceId === 'Licence Re-Entry') && (
                    <label className="block">
                      <span>Licence Number:</span>
                      <span className="relative flex">

                        <input
                          value={formData?.licenceNumber || ""}
                          onChange={(e) => handleChange("licenceNumber", e.target.value)}
                          className="text-sm pl-2 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Licence No:" type="text" />
                      </span>
                    </label>
                  )}


                  {/* vehicle number - for insurence related data*/}
                  {(formData?.serviceId === 'Insurance Renewal' || formData?.serviceId === 'Fresh Insurance' || formData?.serviceId === 'RC Renewal' || formData?.serviceId === 'RC Transfer' || formData?.serviceId === 'RC HP' || formData?.serviceId === 'CF' || formData?.serviceId === 'CF Renewal') && (

                    <label className="block">
                      <span>Vehicle Number:</span>
                      <span className="relative flex">

                        <input
                          value={formData?.vehicleNumber || ""}
                          onChange={(e) => handleChange("vehicleNumber", e.target.value)}
                          className="text-sm pl-2 form-input peer mt-1.5 w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Vehicle No:" type="text" />

                      </span>
                    </label>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* payment method */}
                    <label className="block">
                      <span>Payment Method</span>
                      <span className="relative mt-1 flex">

                        <select
                          value={formData?.paymentMethod}
                          onChange={(e) => handleChange("paymentMethod", e.target.value)}
                          className="px-5 py-2.5 dark:bg-navy-700 form-input peer w-full rounded-lg border border-slate-300 bg-transparent placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent">

                          <option>Select Method</option>
                          <option value="cash">Cash</option>
                          <option value="online">Online</option>
                        </select>
                      </span>
                    </label>

                    {/* renewal date */}
                    {(formData?.serviceId === 'Renewal Licence' || formData?.serviceId === 'Insurance Renewal' || formData?.serviceId === 'Fresh Insurance' || formData?.serviceId === 'RC Renewal' || formData?.serviceId === 'CF Renewal') && (

                      <label className="block">
                        <span>Renewal Date</span>
                        <span className="relative mt-1 flex">
                          <input
                            // fallback empty string ""
                            value={formData?.renewalDate || ""}
                            onChange={(e) => handleChange("renewalDate", e.target.value)}
                            className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" placeholder="Date of renewal" type="date" />
                        </span>
                      </label>
                    )}

                  </div>

                  {/* total amount */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <label className="block">
                      <span>Total Amount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={formData?.totalAmount || ""}
                          onChange={(e) => handleChange("totalAmount", e.target.value)}
                          type="text" placeholder="Total Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* discount amount */}
                    <label className="block">
                      <span>Discount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={formData?.discount || ""}
                          onChange={(e) => handleChange("discount", e.target.value)}
                          type="text" placeholder="Discount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* pay amount */}
                    <label className="block">
                      <span>Pay Amount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={formData?.payAmount || ""}
                          onChange={(e) => handleChange("payAmount", e.target.value)}
                          type="text" placeholder="Total Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* paying amount */}
                    <label className="block">
                      <span>Paying Amount</span>
                      <span className="relative mt-1 flex">

                        <input
                          value={formData?.payingAmount || ""}
                          onChange={(e) => handleChange("payingAmount", e.target.value)}
                          type="number" placeholder="Pay Amount" className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* remarks */}
                    <label className="block">
                      <span>Remarks</span>
                      <span className="relative mt-1 flex">

                        <textarea
                          value={formData?.remarks}
                          onChange={(e) => handleChange("remarks", e.target.value)}
                          rows={2} className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent" />

                      </span>
                    </label>

                    {/* Add Return Date field - ALWAYS VISIBLE in Edit component */}
                    <label className="block mt-4">
                      <span>Return Date</span>
                      <span className="relative mt-1 flex">
                        <input
                          value={formData?.returnDate || ""}
                          onChange={(e) => handleChange("returnDate", e.target.value)}
                          className="text-sm pl-2 form-input peer w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 placeholder:text-slate-400/70 hover:border-slate-400 focus:border-primary dark:border-navy-450 dark:hover:border-navy-400 dark:focus:border-accent"
                          placeholder="Return Date"
                          type="date"
                        />
                      </span>
                    </label>

                  </div>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-focus text-white rounded p-2 w-full mt-4"
                    disabled={loading}>

                    {loading ? 'Updating...' : 'Update Admission'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;