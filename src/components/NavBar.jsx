import React, {useState} from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { Navbar,
    Nav,
    NavbarBrand,
    NavItem,
 } from "reactstrap";
import '../stylesheets/NavBar.css';

function NavBar({user, logOut}) {
    const [menu, setMenu] = useState(false);

    const menuToggle = () => {
        setMenu(!menu);
    }

    const handleLogOut = () => {
        setMenu(!menu);
        logOut();
    }

    return (
        <div className="NavBar-mobile">
            <Navbar>
                <Nav>
                    <NavbarBrand>
                        <h1>The Traveling Disc Project</h1>
                        <div className={`menu-icon ${menu && 'open'}`} onClick={menuToggle}>
                            <div className="bar1"></div>
                            <div className="bar2"></div>
                            <div className="bar3"></div>
                        </div>
                    </NavbarBrand>
                    {menu && 
                    <div className="menu">
                        <NavItem>
                            <NavLink to="/home" onClick={menuToggle}>Home</NavLink>
                                </NavItem>
                        <NavItem>
                            <NavLink to="/checkins" onClick={menuToggle}>Check Ins</NavLink>
                        </NavItem>
                        {!user && 
                        <NavItem>
                            <NavLink to="/register" onClick={menuToggle}>Register</NavLink>
                        </NavItem>
                        }
                        {user && 
                        <NavItem>
                            <NavLink to="/myaccount" onClick={menuToggle}>Account</NavLink>
                        </NavItem>
                        }
                        <NavItem>
                            {user ? <NavLink to='/' onClick={handleLogOut}>Log Out</NavLink> : <NavLink to="/login" onClick={menuToggle}>Login</NavLink> }
                        </NavItem>
                    </div>
                    }
                </Nav>
            </Navbar>
        </div>
    )
}

export default NavBar