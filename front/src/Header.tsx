import React from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg';
import { Link, useLocation } from 'react-router-dom';
import { BackButton } from './components/BackButton';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={'flex items-center py-5 px-content'}>
      {!isHome && <BackButton />}
      <Link to={'/'}>
        <DondeLogo className={'translate-y-0.5'} />
      </Link>
      <MenuIcon className="w-6 text-dark-gray ml-auto" />
    </header>
  );
}
