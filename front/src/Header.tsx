import React from 'react';
import { MenuIcon } from '@heroicons/react/outline'
import  { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg'

export function Header() {
  return (
    <header className={'flex justify-between mx-2'}>
      <DondeLogo/>
      <MenuIcon className="h-6 w-5 200"/>
    </header>
  );
}
