"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../Logo";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/web-components/ui/sheet";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const navItems = [
    { title: "Anasayfa", path: "/" },
    { title: "Yayın Akışı", path: "/yayin-akisi" },
    { title: "Programlar", path: "/programlar" },
    { title: "Basin", path: "/basin" },
    { title: "Reklam", path: "/reklam" },
    { title: "Künye", path: "/kunye" },
    { title: "İletişim", path: "/iletisim" },
  ];

  return (
    <div className="pt-5 w-full overflow-x-hidden">
      <header className={`shadow-[3px_1px_9px_0px_#cecece] py-[20px] bg-white w-full ${
        isScrolled ? "fixed top-0 left-0 right-0 z-50 animate-slideDown" : ""
      }`}>
        <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
          <div className="flex-shrink-0">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-gray-800 hover:text-orange-700 transition-colors font-medium text-sm lg:text-base"
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/canli-yayin"
              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm lg:text-base"
            >
              Canlı Yayın
            </Link>
          </nav>
          
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 text-gray-700 focus:outline-none" aria-label="Menu">
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full py-6">
                  <div className="mb-6">
                    <Logo />
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="text-gray-800 hover:text-kontv-orange transition-colors font-medium py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.title}
                      </Link>
                    ))}
                    <Link
                      href="/canli-yayin"
                      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors mt-2 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Canlı Yayın
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Add padding when header is fixed to prevent content jump */}
      {isScrolled && <div className="h-[92px]"></div>}
    </div>
  );
};

export default Header;
