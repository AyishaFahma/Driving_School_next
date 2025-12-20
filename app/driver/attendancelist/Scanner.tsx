

// import React, { useEffect } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import "./driver.css";

// type ScannerProps = {
//   onScan: (data: string) => void;
//   onClose: () => void;
// };

// const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner(
//       "reader",
//       { fps: 10, qrbox: { width: 250, height: 250 } },
//       false
//     );

//     scanner.render(
//       (decodedText) => {
//         onScan(decodedText);
//         scanner.clear().catch((err) =>
//           console.error("Error stopping scanner:", err)
//         ); // Handle potential errors while stopping the scanner
//       },
//       (error) => {
//         console.error("QR Scanner Error:", error);
//       }
//     );

//     // Ensure cleanup is synchronous
//     return () => {
//       scanner.clear().catch((err) =>
//         console.error("Error during cleanup:", err)
//       );
//     };
//   }, [onScan]);

//   return (
//     <div className="scanner-overlay">
//       <div className="scanner-modal dark:bg-navy-800">
//         <h2 className="scanner-title">Scan QR Code</h2>
//         <div id="reader" className="scanner-frame" />
//         <button
//           className="mt-6 rounded bg-primary px-4 py-2 text-white transition hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Scanner;


import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./driver.css";

type ScannerProps = {
  onScan: (data: string) => void;
  onClose: () => void;
};

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      // (decodedText) => {
      //   try {
      //     const parsedData = JSON.parse(decodedText); // Parse QR data
      //     onScan(parsedData); // Pass parsed object to parent component
      //     scanner.clear().catch((err) =>
      //       console.error("Error stopping scanner:", err)
      //     );
      //   } catch (error) {
      //     console.error("Invalid QR Code Data:", error);
      //     alert("Invalid QR Code. Please try again.");
      //   }
      // },
      (decodedText) => {
        console.log("Decoded Text:", decodedText); // Log the decoded text
        try {
          // const parsedData = JSON.parse(decodedText.trim());
          const parsedData = JSON.parse(decodedText); // Parse QR data
          onScan(parsedData); // Pass parsed object to parent component
          scanner.clear().catch((err) =>
            console.error("Error stopping scanner:", err)
          );
        } catch (error) {
          console.error("Invalid QR Code Data:", error);
          alert("Invalid QR Code. Please try again.");
        }
      },
      (error) => {
        console.error("QR Scanner Error:", error);
      }
    );

    return () => {
      scanner.clear().catch((err) =>
        console.error("Error during cleanup:", err)
      );
    };
  }, [onScan]);

  return (
    <div className="scanner-overlay">
      <div className="scanner-modal dark:bg-navy-800">
        <h2 className="scanner-title">Scan QR Code</h2>
        <div id="reader" className="scanner-frame" />
        <button
          className="mt-6 rounded bg-primary px-4 py-2 text-white transition hover:bg-primary-focus dark:bg-accent dark:hover:bg-accent-focus"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Scanner;






