import React from 'react';
import { MenuIcon } from '@heroicons/react/outline';
import { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg';

export function Header() {
  return (
    <header className={'flex justify-between mx-2 py-4'}>
      <DondeLogo />
      <MenuIcon className="h-6 w-5 text-dark-gray" />
    </header>
  );
}
