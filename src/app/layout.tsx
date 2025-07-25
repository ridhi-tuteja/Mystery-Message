import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Feedbit",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // return (
  //   <html lang="en">
  //     <AuthProvider>
  //       <body>
  //         {children}
  //         <Toaster />
  //       </body>
  //     </AuthProvider> 
  //   </html>
  // );
  return (
    <html lang="en">
      
        <body>
          <AuthProvider>
          {children}
          <Toaster />
          </AuthProvider> 
        </body>
      
    </html>
  );

}
//https://cloud.mongodb.com/v2/686c0d5d51defa06ffeda650#/clusters