import Navbar from "../Navbar/Navbar";
import { LayoutProps } from "./Layout.interface";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8f8f5]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
