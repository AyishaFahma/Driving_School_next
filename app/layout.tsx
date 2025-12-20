
'use client';


import "./globals.css"; // Import global styles
import { usePathname } from "next/navigation";
import DashboardLayout from "./dashboard/DashboardLayout";
import { AuthProvider } from "./context/AuthContext";
import { DrawerProvider } from "./dashboard/DrawerContext";
import { ToastContainer } from "react-toastify";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  const pathname = usePathname();
  // console.log('Current pathname:', pathname);

  return (
    <html lang="en">
      <body x-data="" x-bind="$store.global.documentBody"
        className="is-header-blur">

        <AuthProvider>
          <DrawerProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            {/* Conditional rendering based on the pathname */}
            {pathname.startsWith("/admin") ? (

              <DashboardLayout>
                {children}

              </DashboardLayout>

            ) : (
              children
            )}
          </DrawerProvider>
        </AuthProvider>
      </body>

    </html>

  );
}






