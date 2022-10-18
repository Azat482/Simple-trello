import React from "react";
import {Link} from "react-router-dom";
import css from './styles/header.module.css'

function Header(props){
    return(
        <header className={css.header}>
            <div className={css.header_container}>
                <Link className={css.header__logo_container} to='/'>
                    <h1>Logo</h1>
                </Link>
            </div>
        </header>
    );
}

export default Header;