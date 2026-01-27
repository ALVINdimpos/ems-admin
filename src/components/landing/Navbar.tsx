"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import RegisterModal from "../ui/Modal/RegistrationModel";

import { TranslateFn } from "@/lib/constants/landing";

type NavbarProps = {
  tLanding: TranslateFn;
  tCommon: TranslateFn;
};

export function Navbar({ tLanding, tCommon }: NavbarProps) {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const links = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About us" },
    { href: "#contact", label: "Contact us" },
    { href: "#faq", label: "FAQ" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex w-full h-[70px] md:h-[100px] mx-auto items-center justify-between gap-4 px-4 sm:px-6 md:px-8 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0A1628]/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <div className="relative w-[60px] h-[50px] md:w-[92px] md:h-[77px]">
            <Image
              src="/logo.png"
              alt={tLanding("brand.product")}
              fill
              sizes="(max-width: 768px) 60px, 92px"
              className="object-contain"
              priority
            />
          </div>
          <span className="sr-only">{tLanding("brand.name")}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <nav className="flex items-center gap-4 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm lg:text-base font-semibold text-white hover:text-white/80 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Commented out for now */}
          {/* <LocaleSwitcher /> */}

          <Link
            href="/login"
            className="w-[100px] lg:w-[122px] h-10 lg:h-11 flex items-center justify-center rounded-[10px] border border-white/40 bg-slate-900/60 text-sm font-medium text-white transition hover:border-white/70 hover:bg-slate-900/80"
          >
            {tCommon("login")}
          </Link>
          {/* <Button
            onClick={() => setIsRegistrationModalOpen(true)}
            className="w-[150px] h-11 rounded-[10px] bg-gradient-to-r from-[#1298E5] to-[#1298E5] text-sm font-semibold text-white shadow-lg hover:bg-[#1298E5]/90 cursor-pointer"
          >
            {tCommon("register")}
          </Button> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-[70px] right-0 z-50 w-full sm:w-80 h-[calc(100vh-70px)] bg-[#0A1628] border-l border-white/10 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleLinkClick}
              className="text-lg font-semibold text-white hover:text-white/80 hover:bg-white/5 px-4 py-3 rounded-lg transition"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10 mt-4">
            <Link
              href="/login"
              onClick={handleLinkClick}
              className="w-full h-12 flex items-center justify-center rounded-[10px] border border-white/40 bg-slate-900/60 text-base font-medium text-white transition hover:border-white/70 hover:bg-slate-900/80"
            >
              {tCommon("login")}
            </Link>
          </div>
        </nav>
      </div>

      <RegisterModal
        open={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </>
  );
}
