import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PropertyTheme from "./PropertyTheme";

export const SiteLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PropertyTheme />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default SiteLayout;
