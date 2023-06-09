import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/sass/layout/navBar.module.scss";
import { RxHamburgerMenu } from "react-icons/rx";

function Navbar() {
  const [IsshowMenu, setIsshowMenu] = useState(false);
  const linkClasses = ({ isActive, isPending }) =>
    isActive ? `${styles.active} ${styles.navbarLink}` : `${styles.navbarLink}`;

  return (
    <div className={styles.navBar}>
      <button
        onClick={() => {
          setIsshowMenu(true);
        }}
        className={styles.hamburgerMenu}
      >
        <RxHamburgerMenu />
      </button>
      {
        <ul className={IsshowMenu ? ` ${styles.active}` : ``}>
          <button
            onClick={() => {
              setIsshowMenu(false);
            }}
            className={styles.closeBtnMenu}
          >
            &times;
          </button>
          <li>
            <NavLink
              to="/home"
              onClick={() => setIsshowMenu(false)}
              className={linkClasses}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/platform"
              onClick={() => setIsshowMenu(false)}
              className={linkClasses}
              end
            >
              Platform
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/lp"
              onClick={() => setIsshowMenu(false)}
              className={linkClasses}
              end
            >
              Liquidity Provider
            </NavLink>
          </li>
          <li>
            <NavLink
              className={linkClasses}
              onClick={() => setIsshowMenu(false)}
              to="/about"
              end
            >
              About
            </NavLink>
            <NavLink
              className={linkClasses}
              onClick={() => setIsshowMenu(false)}
              to="/how-to"
              end
            >
              How to
            </NavLink>
          </li>
        </ul>
      }
      <div className={styles.logoWrapper}>
        <p className={styles.logoName}>lendify</p>
      </div>
    </div>
  );
}

export default Navbar;
