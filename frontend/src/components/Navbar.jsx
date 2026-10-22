
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Video,
  UserRound,
  BookOpen,
  CreditCard,
  Info,
  FileText,
  LogOut,
  Code2,
  House,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", icon: House, href: "/" },
  {
    label: "Coding Practice",
    icon: Code2,
    href: "/coding-practice",
  },
  {
    label: "Interview Tools",
    icon: Video,
    dropdown: [
      { label: "HR Interview", href: "#start-interview" },
      { label: "Technical Interview", href: "#start-interview" },
      { label: "Coding Interview", href: "#start-interview" },
      { label: "Communication Interview", href: "#start-interview" },
    ],
  },
  {
    label: "Preparation",
    icon: BookOpen,
    dropdown: [
      { label: "Interview Questions", href: "#questions" },
      { label: "Practice Tests", href: "#practice-tests" },
      { label: "Preparation Guide", href: "#preparation" },
      { label: "Interview History", href: "/history" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  {
    label: "Plans",
    icon: CreditCard,
    href: "/plans",
  },
  {
    label: "About Us",
    icon: Info,
    href: "/about",
  },
];

const pageBackground = "#eeeae6";
const buttonBackground = "#f7f5f2";
const textColor = "#38332f";
const accentColor = "#7c5ce7";

const insetShadow =
  "inset 4px 4px 8px rgba(180,165,150,0.30), inset -4px -4px 8px rgba(255,252,248,0.95)";

const hoverShadow =
  "inset 2px 2px 5px rgba(180,165,150,0.25), inset -2px -2px 5px rgba(255,252,248,0.9)";

const individualButtonStyle = {
  backgroundColor: buttonBackground,
  color: textColor,
  boxShadow: insetShadow,
};

export default function Navbar({ user = null, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenus = () => {
    setMobileOpen(false);
    setActiveDropdown(null);
  };

  // Open the existing interview setup modal on the Home page.
  const handleGetStarted = () => {
    closeMenus();

    if (location.pathname !== "/") {
      navigate("/");

      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("open-interview-setup")
        );
      }, 300);

      return;
    }

    window.dispatchEvent(
      new CustomEvent("open-interview-setup")
    );
  };

  // Handle interview types and normal section links.
  const handleSectionLink = (event, href) => {
    if (href === "#start-interview") {
      event.preventDefault();
      handleGetStarted();
      return;
    }

    closeMenus();

    if (href.startsWith("#")) {
      event.preventDefault();

      if (location.pathname !== "/") {
        navigate("/" + href);
      } else {
        window.location.hash = href;
      }
    }
  };

  const handleHover = (event) => {
    event.currentTarget.style.boxShadow = hoverShadow;
  };

  const handleLeave = (event) => {
    event.currentTarget.style.boxShadow = insetShadow;
  };

  const navButtonClass =
    "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-2.5 py-3 text-xs font-medium transition-all duration-200 2xl:gap-2 2xl:px-3 2xl:text-[13px]";

  const actionButtonClass =
    "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-3 text-xs font-medium transition-all duration-200 2xl:gap-2 2xl:px-3.5 2xl:text-[13px]";

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: pageBackground,
        color: textColor,
      }}
    >
      <nav className="flex min-h-[82px] w-full items-center justify-between gap-2 px-3 py-3 sm:px-5 lg:px-6 2xl:min-h-[90px] 2xl:gap-3 2xl:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenus}
          aria-label="Interviewly home"
          className="flex min-w-0 shrink-0 items-center"
        >
          <img
            src={logo}
            alt="Interviewly"
            className="h-10 w-auto max-w-[165px] object-contain sm:h-11 sm:max-w-[175px] 2xl:h-[50px] 2xl:max-w-[195px]"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-2 xl:flex 2xl:gap-2 2xl:px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isOpen = activeDropdown === item.label;

            return (
              <div key={item.label} className="relative shrink-0">
                {item.dropdown ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setActiveDropdown(isOpen ? null : item.label)
                    }
                    className={navButtonClass}
                    style={individualButtonStyle}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                  >
                    <Icon size={18} strokeWidth={1.8} />

                    <span>{item.label}</span>

                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    onClick={closeMenus}
                    className={navButtonClass}
                    style={individualButtonStyle}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleLeave}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                )}

                {/* Desktop dropdown */}
                {item.dropdown && isOpen && (
                  <div
                    className="absolute left-0 top-full mt-3 w-60 rounded-2xl p-2"
                    style={{
                      backgroundColor: pageBackground,
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      {item.dropdown.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          onClick={(event) =>
                            handleSectionLink(event, link.href)
                          }
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
                          style={individualButtonStyle}
                          onMouseEnter={handleHover}
                          onMouseLeave={handleLeave}
                        >
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor: accentColor,
                            }}
                          />

                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop action buttons */}
        <div className="hidden shrink-0 items-center gap-1.5 xl:flex 2xl:gap-2">
          {user ? (
            <>
              <Link to="/profile" className={actionButtonClass} style={individualButtonStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <UserRound size={18} strokeWidth={1.8} />
                <span className="max-w-[120px] truncate">{user.firstName || user.name || "My Account"}</span>
              </Link>
              <button type="button" onClick={onLogout} className={actionButtonClass} style={individualButtonStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <LogOut size={17} /> Logout
              </button>
            </>
          ) : (
            <Link to="/signup" className={actionButtonClass} style={individualButtonStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              <UserRound size={18} strokeWidth={1.8} /> Sign Up
            </Link>
          )}

          <button
            type="button"
            onClick={handleGetStarted}
            className={actionButtonClass}
            style={individualButtonStyle}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={
            mobileOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl xl:hidden"
          style={individualButtonStyle}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile / tablet navigation */}
      {mobileOpen && (
        <div
          className="px-4 pb-5 sm:px-6 xl:hidden"
          style={{
            backgroundColor: pageBackground,
          }}
        >
          <div className="flex flex-col gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isOpen = activeDropdown === item.label;

              return (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setActiveDropdown(
                            isOpen ? null : item.label
                          )
                        }
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-sm font-medium"
                        style={individualButtonStyle}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} />
                          {item.label}
                        </span>

                        <ChevronDown
                          size={17}
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="ml-4 mt-3 flex flex-col gap-3 sm:ml-6">
                          {item.dropdown.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              onClick={(event) =>
                                handleSectionLink(event, link.href)
                              }
                              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
                              style={individualButtonStyle}
                            >
                              <FileText
                                size={16}
                                style={{
                                  color: accentColor,
                                }}
                              />

                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-medium"
                      style={individualButtonStyle}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Mobile action buttons */}
            <div className="mt-1 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={closeMenus} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium" style={individualButtonStyle}>
                    <UserRound size={18} /> {user.firstName || user.name || "My Account"}
                  </Link>
                  <button type="button" onClick={() => { closeMenus(); onLogout?.(); }} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium" style={individualButtonStyle}>
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/signup" onClick={closeMenus} className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium" style={individualButtonStyle}>
                  <UserRound size={18} /> Sign Up
                </Link>
              )}

              <button
                type="button"
                onClick={handleGetStarted}
                className="flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium"
                style={individualButtonStyle}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
