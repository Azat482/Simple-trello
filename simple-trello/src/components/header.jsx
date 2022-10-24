import React from "react";
import {Link} from "react-router-dom";
import css from './styles/header.module.css'
import header_logo from './images/trello.svg'

function Header(props){
    return(
        <header className={css.header__container}>
            <div className={css.header__content}>
                <Link className={css.header__logo_container} to='/'>
                    <img src={header_logo} alt="logo" height="80px"/>
                </Link>
            </div>
        </header>
    );
}

export default Header;