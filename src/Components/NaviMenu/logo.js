import React from 'react';
import styles from './sideMenu.module.css'
import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <NavLink to="/" className={"logo"}>
        <div className={styles.logo} >  </div>
      </NavLink>
    </div>
)}

export default Logo;