
'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { IoMdPrint } from 'react-icons/io';


import { toast } from 'react-toastify';

type Payment = {
  id?: string;
  payment_status: string;
  service_name: string;
  amount: string;
  added_date: string;
  mobile: string;
  service_id: number;
  details: string;
  pay_amount: string;
  amount_total: string;
  pending_amount: string;
  payment_method: string;
  first_name: string;
  email: string;
  billno: string;

};

type Site = {
  id?: string;
  name: string;
  address: string;
  email: string;
  phone: string;

};

const ViewPayment = () => {
  const [paymentData, setPaymentData] = useState<{ user_id: string; cus_service_id: string } | null>(null);


  const { state } = useAuth();

  const [siteData, setsiteData] = useState<Site | null>(null);

  const [paymentDatas, setpaymentDatas] = useState<Payment[]>([]);

  //const [amount, setamount] = useState<Payment | null>(null);

  const [userData, setuserData] = useState<Payment | null>(null);
  const [admissionData, setAdmissionData] = useState<Payment[]>([]);

  const [error, setError] = useState<string | null>(null);



  // view-payment page load and it retrieve the data
  // get the data from sessionstorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('viewPaymentData');
    if (storedData) {
      setPaymentData(JSON.parse(storedData));
    }
  }, []);


  // fetch site info
  useEffect(() => {
    fetchsiteinfo()
  }, [state])


  // finally fetch payment history when paymentdata is available
  useEffect(() => {
    if (paymentData) {
      fetchpaymenthistory();
    }
  }, [paymentData, state]);



  // if (!paymentData) {
  //   return <p>Loading...</p>;
  // }


  // These variables are extracted FROM the paymentData state , when payment data is available
  const user_id = paymentData?.user_id;
  const cus_service_id = paymentData?.cus_service_id;



  const fetchsiteinfo = async () => {
    try {

      const response = await fetch('/api/admin/settings/site_details', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '',
          // 'authorizations': token ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',  // Make sure the API key is correct
        },
        body: JSON.stringify({
          id: 1
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // console.error('API error:', errorData);
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("siteinfo", data)
      if (data.success) {
        setsiteData(data.data || []);

      } else {
        // console.error("API error:", data.msg || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  console.log("site data", siteData);




  // view payment of single user
  const fetchpaymenthistory = async () => {

    if (!paymentData) return;

    try {
      console.log("Fetching payment history with:", {
        id: cus_service_id,
        user_id: user_id,
      });

      const response = await fetch('/api/admin/report/view_payment', {
        method: 'POST',
        headers: {
          'authorizations': state?.accessToken ?? '',
          'api_key': '10f052463f485938d04ac7300de7ec2b',
        },
        body: JSON.stringify({
          id: cus_service_id,  // from paymentData state
          user_id: user_id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status} - ${errorData.message || 'Unknown error'
          }`
        );
      }

      const data = await response.json();
      console.log("view payment data", data);

      if (data.success) {
        setpaymentDatas(data.data.payment_details);
        setuserData(data.data.user_details);
        console.log("payment_details", data.data.payment_details);
        console.log("user_details", data.data.user_details);


      } else {
        setError(data.msg || "Failed to fetch data");
      }
    } catch (error: any) {
      console.error("Fetch error:", error.message || error);
      setError(error.message || "Unknown error occurred");
    }
  };



  //loading state
  if (!paymentData) {
    return <p>Loading...</p>;
  }


  const totalAmount = paymentDatas[0]?.amount_total;

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // Adjust format as needed
  };




  //working print - image

  // const handlePrint = async () => {
  //   try {
  //     const element = document.querySelector('.copy') as HTMLElement;
  //     if (!element) {
  //       toast.warning("Content not available for printing");
  //       return;
  //     }

  //     // Apply temporary styling for better image output
  //     const originalStyles = {
  //       width: element.style.width,
  //       padding: element.style.padding,
  //       margin: element.style.margin,
  //     };

  //     // Set fixed width for consistent image size
  //     element.style.width = '800px';
  //     element.style.padding = '20px';
  //     element.style.margin = '0 auto';

  //     // Generate canvas with controlled size
  //     const canvas = await html2canvas(element, {
  //       scale: 2, // Reduce scale for smaller file size
  //       width: 800, // Fixed width
  //       height: element.scrollHeight,
  //       useCORS: true,
  //       logging: false,
  //       backgroundColor: '#ffffff',
  //       removeContainer: true,
  //     });

  //     // Restore original styles
  //     element.style.width = originalStyles.width;
  //     element.style.padding = originalStyles.padding;
  //     element.style.margin = originalStyles.margin;

  //     // Generate and download all formats
  //     const timestamp = new Date().getTime();
  //     const customerName = userData?.first_name || 'customer';

  //     const formats = [
  //       { type: 'png', mimeType: 'image/png', quality: 0.8 }, // Reduced quality
  //       { type: 'jpg', mimeType: 'image/jpeg', quality: 0.7 }, // Further reduced for JPEG
  //       { type: 'jpeg', mimeType: 'image/jpeg', quality: 0.7 }
  //     ];

  //     formats.forEach((format, index) => {
  //       setTimeout(() => {
  //         const imageDataUrl = canvas.toDataURL(format.mimeType, format.quality);
  //         const link = document.createElement('a');
  //         const fileName = `payment-receipt-${customerName}-${timestamp}.${format.type}`;

  //         link.download = fileName;
  //         link.href = imageDataUrl;
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //       }, index * 300);
  //     });

  //     toast.success("Payment receipt saved as PNG, JPG, and JPEG files!");

  //   } catch (error) {
  //     console.error('Error generating images:', error);
  //     toast.error('Error generating receipt images. Please try again.');
  //   }
  // };


  // not work on chrome - others working
  const handlePrint = () => {
    const printContents = document.querySelector('.copy')?.innerHTML;
    const currentDateTime = getCurrentDateTime();
    
    if (printContents && siteData) { // Check if siteData is available
      const originalContents = document.body.innerHTML;
  
      const customHeader = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <p class="print-date-time" style="margin: 0;">${currentDateTime}</p>
          <p class="print-header" style="text-align: center; flex-grow: 1; margin: 0;">View Payment Details | ${siteData.name}</p>
        </div>
      `;
  
      document.body.innerHTML = customHeader + printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
    else {
      alert("Printing is blocked by the browser. Try enabling pop-ups.");
    }
  };


  
  return (

    <div className="w-full pb-8">
      <div className="flex items-center space-x-4 py-5 lg:py-6">



        <h2 className="text-xl font-medium text-slate-800 dark:text-navy-50 lg:text-2xl">
          View Payment Details
        </h2>
        <div className="hidden h-full py-1 sm:flex">
          <div className="h-full w-px bg-slate-300 dark:bg-navy-600" />
        </div>
        <ul className="hidden flex-wrap items-center space-x-2 sm:flex">
          <li className="flex items-center space-x-2">
            <a className="text-primary transition-colors hover:text-primary-focus dark:text-accent-light dark:hover:text-accent" href="#">Home
            </a>

          </li>

        </ul>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 copy">

        <div className="card px-4 pb-4 sm:px-5 mt-5">

          <div className="mt-5 ">
            <div className="p-4 flex flex-col lg:flex-row lg:justify-between">
              {siteData && (
                <div className="text-left">
                  <p>Billed From</p>
                  <div className="mt-4">
                    <h6 className="font-bold">{siteData.name}</h6>
                    <div dangerouslySetInnerHTML={{ __html: siteData.address }} />
                    <p>
                      <br />Tel No: {siteData.phone}
                      <br />Email: {siteData.email}
                    </p>
                  </div>
                </div>
              )}

              {userData && (
                <div className="mt-4 lg:mt-0 text-right">
                  <p>Billed To</p>
                  <div className="mt-4">
                    <h6 className="font-bold mb-2">{userData.first_name}</h6>
                    Total Amount: {totalAmount}
                    <br />Tel No: {userData.mobile}
                    <br />Email: {userData.email}
                  </div>
                </div>
              )}
            </div>




            <div className="overflow-x-auto w-full">

              <table className="is-hoverable w-full text-left">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap rounded-l-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      SL NO
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Bill NO
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Pay Amount
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Due Amount
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Payment Status
                    </th>
                    <th className="whitespace-nowrap bg-slate-200 px-4 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Payment Method
                    </th>
                    <th className="whitespace-nowrap rounded-r-lg bg-slate-200 px-3 py-3 font-semibold uppercase text-slate-800 dark:bg-navy-800 dark:text-navy-100 lg:px-5">
                      Date
                    </th>
                  </tr>
                </thead>



                <tbody>
                  {paymentDatas.map((item, index) => (
                    <tr key={item.id} className="border-y border-transparent border-b-slate-200 dark:border-b-navy-500">
                      <td className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.amount_total}
                        {/* {index === 0 ? item.amount_total : ""}  */}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.pay_amount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.pending_amount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.payment_status}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 sm:px-5">
                        {item.payment_method}
                      </td>
                      <td className="whitespace-normal max-w-xs px-4 py-3 sm:px-5">
                        {item.added_date}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan={2} className="whitespace-nowrap rounded-l-lg px-4 py-3 sm:px-5">
                      <strong>Total Payed Amount:</strong>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 sm:px-5 font-semibold">

                      ₹  {paymentDatas.reduce((total, item) => total + (Number(item.pay_amount) || 0), 0)}
                    </td>
                    <td colSpan={4} className="whitespace-nowrap px-4 py-3 sm:px-5"></td>
                  </tr>
                </tbody>
              </table>

            </div>


          </div>

          <div className="mt-3 flex justify-end">
            <button onClick={handlePrint} className="printnone inline-flex items-center space-x-2 px-4 py-2 bg-[#dc3545] text-white rounded-md">
              <span>Print</span>
              <IoMdPrint />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewPayment;
