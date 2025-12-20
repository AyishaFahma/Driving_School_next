import Image from "next/image";


import { DrawerProvider } from "./dashboard/DrawerContext";
import DashboardLayout from "./dashboard/DashboardLayout";
import Login from "./login/page";


export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}




// import { SessionProvider } from "next-auth/react"

// export default function App({
//   Component,
//   pageProps: { session, ...pageProps },
// }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   )
// }