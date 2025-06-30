import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBarsStaggered, FaXmark, FaChevronDown } from "react-icons/fa6";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAISkillsOpen, setIsAISkillsOpen] = useState(false);
  const { user, logout, isRecruiter, isStudent } = useAuth();
  const dropdownRef = useRef(null);
  const handleMenuToggler = () => setIsMenuOpen(!isMenuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAISkillsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getNavItems = () => {
    const baseItems = [
      { path: "/", title: "Home" }
    ];

    // Browse Jobs removed as requested

    if (user) {
      baseItems.push({ path: "/dashboard", title: "Dashboard" });

      if (isStudent()) {
        baseItems.push(
          { path: "/applied-jobs", title: "Applied" },
          { path: "/saved-jobs", title: "Saved" }
        );
      }

      if (isRecruiter()) {
        baseItems.push(
          { path: "/create-job", title: "Post Job" },
          { path: "/my-jobs", title: "My Jobs" },
          { path: "/applications", title: "Applications" }
        );
      }
    }

    baseItems.push({ path: "/about", title: "About" });
    return baseItems;
  };

  const aiSkillsItems = [
    { path: "/resume-builder", title: "Resume Builder", icon: "📄" },
    { path: "/mock-interview", title: "Mock Interview", icon: "🎤" },
    { path: "/skills-quiz", title: "Skills Quiz", icon: "🧠" }
  ];

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md py-6 px-8">
      <nav className="flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1055/1055687.png"
            alt="logo"
            className="w-8 h-8"
          />
          <span className="text-2xl font-semibold text-black-800">HireHub</span>
        </div>

        {/* Center - Nav Items (hidden when navbar gets crowded) */}
        <ul className="hidden lg:flex gap-3 text-sm font-medium text-black-700">
          {navItems.slice(0, 6).map(({ path, title }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `transition-colors duration-200 hover:text-blue-500 px-2 py-1 rounded ${
                    isActive ? "text-purple-600 font-semibold bg-purple-50" : ""
                  }`
                }
              >
                {title}
              </NavLink>
            </li>
          ))}

          {/* AI Skills Dropdown - Only show for students and non-logged-in users, NOT for recruiters */}
          {(!user || isStudent()) && (
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAISkillsOpen(!isAISkillsOpen)}
                className="flex items-center gap-1 transition-colors duration-200 hover:text-blue-500 px-2 py-1 rounded"
              >
                🤖 AI Skills
                <FaChevronDown className={`text-xs transition-transform ${isAISkillsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isAISkillsOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48 z-50">
                  {aiSkillsItems.map(({ path, title, icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => setIsAISkillsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600 ${
                          isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700"
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span>{title}</span>
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          )}
        </ul>

        {/* User info or login/signup buttons (only on large screens) */}
        <div className="text-sm font-medium space-x-2 hidden lg:block">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 text-xs">Welcome, {user.name}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user.role === 'recruiter' ? 'Recruiter' : 'Student'}
              </span>
              <button
                onClick={handleLogout}
                className="py-1 px-3 border rounded bg-red-500 text-white hover:bg-red-600 transition text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: '#374151',
                  backgroundColor: 'white',
                  transition: 'all 0.2s',
                  marginRight: '8px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #3b82f6',
                  borderRadius: '6px',
                  fontSize: '14px',
                  textDecoration: 'none',
                  color: 'white',
                  backgroundColor: '#3b82f6',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.borderColor = '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.borderColor = '#3b82f6';
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button (when navbar gets crowded) */}
        <div className="lg:hidden block">
          <button onClick={handleMenuToggler} className="p-2">
            {
              isMenuOpen ? <FaXmark className="w-5 h-5 text-gray-700" /> : <FaBarsStaggered className="w-5 h-5 text-gray-700" />
            }
          </button>
        </div>
      </nav>

      {/* Mobile menu (when navbar gets crowded) */}
      <div className={`lg:hidden px-4 bg-gray-800 py-5 rounded-sm mt-2 ${isMenuOpen ? "" : "hidden"}`}>
        <ul>
          {navItems.map(({ path, title }) => (
            <li key={path} className="text-base text-white py-2 border-b border-gray-700">
              <NavLink
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block transition-colors duration-200 hover:text-blue-400 ${
                    isActive ? "text-blue-400 font-semibold" : ""
                  }`
                }
              >
                {title}
              </NavLink>
            </li>
          ))}

          {/* AI Skills Section in Mobile - Only show for students and non-logged-in users, NOT for recruiters */}
          {(!user || isStudent()) && (
            <li className="text-white py-2 border-b border-gray-700">
              <div className="text-blue-300 font-semibold mb-2">🤖 AI Skills</div>
              {aiSkillsItems.map(({ path, title, icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block pl-4 py-1 text-sm transition-colors duration-200 hover:text-blue-400 ${
                      isActive ? "text-blue-400 font-semibold" : ""
                    }`
                  }
                >
                  {icon} {title}
                </NavLink>
              ))}
            </li>
          )}

          {!user && (
            <>
              <li className="text-white py-2 border-b border-gray-700">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              </li>
              <li className="text-white py-2">
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
              </li>
            </>
          )}
          {user && (
            <li className="text-white py-2">
              <button onClick={handleLogout} className="text-red-400">Logout</button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
