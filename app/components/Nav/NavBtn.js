import React from 'react';
import style from './Nav.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router';

const css = classNames.bind(style);

function NavBtn({ label, checked, to, pathname, btnBackground }) {
  return (
    <li className={ css('menu-item', pathname ? 'active' : null) }>
      <label className={ css('menu-label', 'btn') }>
        <Link to={ to } className={ css('menu-label-btn') }>
          <img src={ btnBackground } className={ css('btn-background') }></img>
          <div className={ css('btn-slide') }></div>
          <p className={ css('label-name') }>{ label }</p>
        </Link>
      </label>
    </li>
  );
}

export default NavBtn;
