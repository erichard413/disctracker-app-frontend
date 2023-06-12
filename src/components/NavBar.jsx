import React from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { Navbar,
    Nav,
    NavbarBrand,
    NavItem,
 } from "reactstrap";

function NavBar({user, logOut}) {
    return (
        <div className="NavBar">
            <Navbar>
                <Nav>
                    <NavItem>
                        <NavLink to="/home">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/register">Register</NavLink>
                    </NavItem>
                    <NavItem>
                    {user ? <NavLink to='/' onClick={logOut}>Log Out</NavLink> : <NavLink to="/login">Login</NavLink> }
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    )
}

export default NavBar