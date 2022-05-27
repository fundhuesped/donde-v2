import React from 'react';
import  { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg'
import { ReactComponent as BurgerButton } from './assets/images/BurgerButton.svg'

export function Header() {
  return (
    <header className={'flex justify-between mx-2'}>
      <DondeLogo/>
      <BurgerButton/>
    </header>
  );
}
