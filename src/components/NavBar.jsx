import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate, NavLink } from "react-router-dom";
import { Navbar, Nav, NavbarBrand, NavItem } from "reactstrap";
import "../stylesheets/NavBar.css";
import { useUser } from "../hooks/useUserContext";
import logo from "../assets/logo-wordmark-sm.png";

function NavBar({ logOut }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const prevIsOpen = useRef();
  const wrapperRef = useRef();

  useEffect(() => {
    function outsideClickHandler(e) {
      if (!wrapperRef.current.contains(e.target)) {
        if (prevIsOpen.current || isOpen) setIsOpen(state => !state);
      }
    }
    document.addEventListener("click", outsideClickHandler);
    return () => {
      document.removeEventListener("click", outsideClickHandler);
    };
  }, [isClosing]);

  useLayoutEffect(() => {
    if (!isOpen && prevIsOpen.current) {
      console.log("use layout effect");
      setIsClosing(state => !state);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const handleLogOut = () => {
    setIsOpen(false);
    logOut();
  };

  const handleMenuIconClick = () => {
    setIsOpen(state => !state);
  };

  return (
    <div ref={wrapperRef} className="NavBar-mobile">
      <Navbar>
        <Nav>
          <div className="navbar-brand">
            <div>
              <img
                id="logo"
                src={logo}
                alt="traveling-disc-logo"
                onClick={() => {
                  navigate("/home");
                  if (isOpen) handleMenuIconClick();
                }}
              />

              <div
                className={`menu-icon ${isOpen ? `button-open` : ""}`}
                onClick={handleMenuIconClick}
              >
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
            </div>
          </div>

          {(isOpen || isClosing || prevIsOpen.current) && (
            <div
              onAnimationEnd={() => {
                setIsClosing(false);
              }}
              className={`menu ${isOpen || isClosing ? "open" : ""} ${
                isClosing ? "close" : ""
              }`}
            >
              <NavItem>
                <NavLink to="/home" onClick={handleMenuIconClick}>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/faqs" onClick={handleMenuIconClick}>
                  FAQs
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/checkins" onClick={handleMenuIconClick}>
                  Check Ins
                </NavLink>
              </NavItem>
              {!user && (
                <NavItem>
                  <NavLink to="/register" onClick={handleMenuIconClick}>
                    Sign Up
                  </NavLink>
                </NavItem>
              )}
              {user && (
                <NavItem>
                  <NavLink to="/myaccount" onClick={handleMenuIconClick}>
                    Account
                  </NavLink>
                </NavItem>
              )}
              {user && user.isAdmin && (
                <NavItem>
                  <NavLink to="/admin" onClick={handleMenuIconClick}>
                    Admin
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                {user ? (
                  <NavLink
                    to="/"
                    onClick={() => {
                      handleLogOut();
                    }}
                  >
                    Log Out
                  </NavLink>
                ) : (
                  <NavLink to="/login" onClick={handleMenuIconClick}>
                    Login
                  </NavLink>
                )}
              </NavItem>
            </div>
          )}
          {/* {!isOpen && !isClosing ? (
            <></>
          ) : (
            <div
              onAnimationEnd={() => {
                setIsClosing(false);
              }}
              className={`menu ${isOpen ? "open" : ""} ${
                isClosing ? "close" : ""
              }`}
            >
              <NavItem>
                <NavLink to="/home" onClick={menuToggle}>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/checkins" onClick={menuToggle}>
                  Check Ins
                </NavLink>
              </NavItem>
              {!user && (
                <NavItem>
                  <NavLink to="/register" onClick={menuToggle}>
                    Register
                  </NavLink>
                </NavItem>
              )}
              {user && (
                <NavItem>
                  <NavLink to="/myaccount" onClick={menuToggle}>
                    Account
                  </NavLink>
                </NavItem>
              )}
              {user && user.isAdmin && (
                <NavItem>
                  <NavLink to="/admin" onClick={menuToggle}>
                    Admin
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                {user ? (
                  <NavLink to="/" onClick={handleLogOut}>
                    Log Out
                  </NavLink>
                ) : (
                  <NavLink to="/login" onClick={menuToggle}>
                    Login
                  </NavLink>
                )}
              </NavItem>
            </div>
          )} */}
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
