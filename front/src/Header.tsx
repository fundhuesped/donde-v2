import React from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className={'flex justify-between mx-4 mt-10 mb-5'}>
      <Link to={'/'}>
        <DondeLogo />
      </Link>
      <MenuIcon className="h-6 w-5" />
    </header>
  );
}
