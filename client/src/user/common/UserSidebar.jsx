import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaCode, FaProjectDiagram, FaGraduationCap, FaChalkboardTeacher, FaChevronRight } from "react-icons/fa";
const CustomDropDown = ({ 
  name, 
  subLinks, 
  icon, 
  open, 
  href, 
  sidebarWidth, 
  index,
  activeDropdown,
  setActiveDropdown,
  activeSubDropdown,
  setActiveSubDropdown
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [activeNestedMenu, setActiveNestedMenu] = useState(null);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const nestedTimeoutRef = useRef(null);
  const popoverRef = useRef(null);

  // Check if this dropdown is currently open
  const isDropdownOpen = activeDropdown === index;

  // Check if current path matches this link or any sublink
  const isActive =
    location.pathname === href ||
    (subLinks && Array.isArray(subLinks) &&
      subLinks.some((sub) => {
        if (location.pathname === sub.href) return true;
        if (sub.subLinks && sub.subLinks.some(nestedSub => location.pathname === nestedSub.href)) return true;
        return false;
      }));
      
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setActiveNestedMenu(null);
    }, 300);
  };

  const handleNestedMouseEnter = (nestedIndex) => {
    if (nestedTimeoutRef.current) {
      clearTimeout(nestedTimeoutRef.current);
    }
    setActiveNestedMenu(nestedIndex);
  };

  const handleNestedMouseLeave = () => {
    nestedTimeoutRef.current = setTimeout(() => {
      setActiveNestedMenu(null);
    }, 300);
  };

  const toggleDropdown = () => {
    // If clicking on the same dropdown that's already open, close it
    if (isDropdownOpen) {
      setActiveDropdown(null);
      setActiveSubDropdown(null); // Close all sub-dropdowns too
    } else {
      // Otherwise, open this dropdown (and close any other)
      setActiveDropdown(index);
      setActiveSubDropdown(null); // Reset sub-dropdowns when switching main dropdowns
    }
  };

  const toggleSubDropdown = (subIndex) => {
    const subDropdownId = `${index}-${subIndex}`;
    if (activeSubDropdown === subDropdownId) {
      setActiveSubDropdown(null);
    } else {
      setActiveSubDropdown(subDropdownId);
    }
  };

  // Handle click outside popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !open &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsHovered(false);
        setActiveNestedMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (nestedTimeoutRef.current) {
        clearTimeout(nestedTimeoutRef.current);
      }
    };
  }, [open]);

  // Calculate position for the popover with smart positioning
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const [positionCalculated, setPositionCalculated] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setPositionCalculated(false);
      return;
    }

    if (isHovered && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const estimatedPopoverHeight = (subLinks?.length || 0) * 40 + 50;
      const wouldExtendBeyondBottom = rect.top + estimatedPopoverHeight > viewportHeight;

      let topPosition;
      if (wouldExtendBeyondBottom) {
        const spaceNeeded = Math.min(estimatedPopoverHeight, rect.top);
        topPosition = rect.top - spaceNeeded + rect.height;
      } else {
        topPosition = rect.top;
      }

      setPopoverPosition({
        top: topPosition,
        left: rect.right + 5,
      });
      setPositionCalculated(true);
    }
  }, [isHovered, subLinks]);

  const handleItemClick = () => {
    if (subLinks && Array.isArray(subLinks) && subLinks.length > 0) {
      if (open) {
        toggleDropdown();
      }
    } else {
      navigate(href);
    }
  };

  const handleSubItemClick = (subLink, subIndex) => {
    if (subLink.subLinks && subLink.subLinks.length > 0) {
      // If it has nested sublinks, toggle the sub-dropdown
      toggleSubDropdown(subIndex);
    } else {
      // Navigate to the link if no sub-links
      if (subLink.href) {
        navigate(subLink.href);
      }
    }
  };

  return (
    <>
      <div
        className={`relative ${!open && "w-full"}`}
        ref={dropdownRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`px-4 py-1.5 flex items-center text-white justify-between cursor-pointer rounded-md transition-all duration-200 ${
            isActive ? "bg-indigo-600" : "hover:bg-[#494E53]"
          }`}
          onClick={handleItemClick}
        >
          <div className="flex items-center gap-2">
            <div
              className={`text-xl p-1 rounded-md ${
                isActive ? "text-white" : "text-gray-300"
              }`}
            >
              {Array.isArray(icon) ? (
                <div className="flex items-center justify-center gap-3">
                  {icon.map((item, iconIndex) => (
                    <div key={iconIndex} className="text-md -ml-3">
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <>{icon}</>
              )}
            </div>
            {open && (
              <span className="font-medium text-white truncate transition-all duration-300">
                {name}
              </span>
            )}
          </div>
          {subLinks && Array.isArray(subLinks) && subLinks.length > 0 && open && (
            <div
              className={`text-sm text-gray-300 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-90" : ""
              }`}
            >
              <FaChevronRight />
            </div>
          )}
        </div>

        {/* Dropdown when sidebar is open */}
        {open &&
          isDropdownOpen &&
          subLinks &&
          Array.isArray(subLinks) &&
          subLinks.length > 0 && (
            <div className="pl-8 py-1">
              {subLinks.map((subLink, subIndex) => (
                <div key={subIndex} className="relative">
                  <div
                    className={`py-2 cursor-pointer rounded-md transition-all duration-200 ${
                      location.pathname === subLink.href
                        ? "text-indigo-400 border-b-2 border-b-indigo-400"
                        : "text-gray-300 hover:text-white border-b-2 border-transparent hover:border-b-violet-400"
                    }`}
                    onClick={() => handleSubItemClick(subLink, subIndex)}
                  >
                    <div className=" w-full px-2 flex justify-between items-center">
                      <span>{subLink.name}</span>
                      {subLink.subLinks && subLink.subLinks.length > 0 && (
                        <FaChevronRight 
                          className={`text-xs transition-transform duration-200 ${
                            activeSubDropdown === `${index}-${subIndex}` ? "rotate-90" : ""
                          }`} 
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Nested dropdown for items with subLinks */}
                  {subLink.subLinks && 
                   subLink.subLinks.length > 0 && 
                   activeSubDropdown === `${index}-${subIndex}` && (
                    <div className="pl-4 py-1 rounded-md ml-2 mt-1">
                      {subLink.subLinks.map((nestedLink, nestedIndex) => (
                        <Link
                          key={nestedIndex}
                          to={nestedLink.href}
                          className={`block px-2 py-1.5 text-sm rounded transition-all duration-200 border-b-2 ${
                            location.pathname === nestedLink.href
                              ? "text-white border-b-indigo-400"
                              : "text-gray-300 hover:text-white border-transparent hover:border-b-violet-400"
                          }`}
                        >
                          {nestedLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Popover menu for collapsed sidebar */}
      {!open &&
        isHovered &&
        positionCalculated &&
        subLinks &&
        Array.isArray(subLinks) &&
        subLinks.length > 0 && (
          <div
            ref={popoverRef}
            className="fixed bg-[#343A40] shadow-lg border hidden md:block border-gray-700 rounded-md py-1 w-48 z-50"
            style={{
              top: popoverPosition.top,
              left: popoverPosition.left,
              opacity: 1,
              transition: "opacity 0.15s ease-in-out",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="font-medium text-white border-b border-gray-700 px-4 py-2 mb-1">
              {name}
            </div>
            {subLinks.map((subLink, subIndex) => (
              <div 
                key={subIndex}
                className="relative"
                onMouseEnter={subLink.subLinks ? () => handleNestedMouseEnter(subIndex) : undefined}
                onMouseLeave={subLink.subLinks ? handleNestedMouseLeave : undefined}
              >
                <Link
                  to={subLink.href || "#"}
                  className={` px-4 py-2 text-sm transition-colors duration-200 flex justify-between items-center ${
                    location.pathname === subLink.href
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-[#494E53] hover:text-white"
                  }`}
                >
                  <span>{subLink.name}</span>
                  {subLink.subLinks && subLink.subLinks.length > 0 && (
                    <FaChevronRight className="text-xs" />
                  )}
                </Link>
                
                {/* Nested sub-menu for collapsed sidebar */}
                {subLink.subLinks && subLink.subLinks.length > 0 && activeNestedMenu === subIndex && (
                  <div className="absolute left-full top-0 bg-[#343A40] shadow-lg border border-gray-700 rounded-md py-1 w-48 z-50 -mt-2">
                    {subLink.subLinks.map((nestedLink, nestedIndex) => (
                      <Link
                        key={nestedIndex}
                        to={nestedLink.href}
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          location.pathname === nestedLink.href
                            ? "bg-indigo-600 text-white"
                            : "text-gray-300 hover:bg-[#494E53] hover:text-white"
                        }`}
                      >
                        {nestedLink.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </>
  );
};

export default function SuperAdminSidebar({ open, setOpen }) {
  const sidebarRef = useRef(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open && window.innerWidth < 1024) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setOpen]);

  // Close all dropdowns when sidebar is closed
  useEffect(() => {
    if (!open) {
      setActiveDropdown(null);
      setActiveSubDropdown(null);
    }
  }, [open]);

 const links = [
  // {
    // href: "/user",
    // icon: <FaUser />,
    // name: "User Dashboard",
    // sub: [
      {
        name: "Profile",
        href: "/user/profile",
        icon: <FaUser />,
        subLinks: [],
      },
      {
        name: "Skills",
        href: "/user/skills",
        icon: <FaCode />,
        subLinks: [],
      },
      {
        name: "Projects",
        href: "/user/projects",
        icon: <FaProjectDiagram />,
        subLinks: [],
      },
      {
        name: "Tutorials",
        href: "/user/tutorials",
        icon: <FaChalkboardTeacher />,
        subLinks: [],
      },
      {
        name: "Internships",
        href: "/user/internships",
        icon: <FaGraduationCap />,
        subLinks: [],
      },
      {
        name: "work-history",
        href: "/user/work-history",
        icon: <FaGraduationCap />,
        sub: [
          {
            name: "All works",
            href: "/user/work-history",
            subLinks: [],
          },
          {
            name: "Add Work History",
            href: "/user/work-history/create",
            subLinks: [],
          },
        ],
      },
      {
        name: "cources",
        href: "/user/cources",
        icon: <FaGraduationCap />,
       
      },
    // ],
  // },
];
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-10 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed z-20 top-0 left-0 h-full bg-[#343A40] shadow-lg transition-all duration-300 ease-in-out
          ${open ? "w-64" : "w-0 lg:w-20"}
          overflow-y-auto
          scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent
          ${open ? "" : "lg:hover:w-20"}
        `}
      >
        <div className="px-4 py-5">
          <h2
            className={`text-center text-xl font-semibold text-white transition-opacity duration-300 ${
              !open && "opacity-0 lg:opacity-100 lg:text-sm"
            }`}
          >
            {open ? "User Dashboard" : "User"}
          </h2>
        </div>

        <div className="mt-2 flex flex-col space-y-1">
          {links.map((link, index) => (
            <CustomDropDown
              key={index}
              href={link.href}
              icon={link.icon}
              name={link.name}
              subLinks={link.sub}
              open={open}
              sidebarWidth={open ? "256px" : "80px"}
              index={index}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              activeSubDropdown={activeSubDropdown}
              setActiveSubDropdown={setActiveSubDropdown}
            />
          ))}
        </div>
      </div>
    </>
  );
}