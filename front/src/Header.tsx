import React, { useState } from 'react';
import { MenuIcon, InformationCircleIcon, ChatAltIcon } from '@heroicons/react/outline';
import { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg';
import { Button } from './components/Button';
import MainContainer from './components/MainContainer';
import { Link, useLocation } from 'react-router-dom';
import { BackButton } from './components/BackButton';

export function Header({ onMenuOpening: handleMenuOpening }: { onMenuOpening: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    handleMenuOpening();
  };
    const location = useLocation();
    const isHome = location.pathname === '/';
  return (
    <header className={'flex items-center py-5 px-content'}>
        {!isHome && <BackButton />}
        <Link to={'/'}>
            <DondeLogo className={'translate-y-0.5'} />
        </Link>
      <button onClick={handleClickMenu}>
        <MenuIcon className="w-6 text-dark-gray ml-auto" />
      </button>
      {isMenuOpen && (
        <div className={'absolute min-h-screen w-full left-0 top-10 flex'}>
          <MainContainer>
            <Button
              className={'border-donde-gray-200'}
              type={'tertiary'}
              alignment={'left'}
              icon={<InformationCircleIcon className={'h-6 w-5'} />}
            >
              Sobre Dónde
            </Button>
            <Button
              className={'border-donde-gray-200'}
              type={'tertiary'}
              alignment={'left'}
              icon={<ChatAltIcon className={'h-6 w-5'} />}
            >
              Preguntas frecuentes
            </Button>
          </MainContainer>
        </div>
      )}
    </header>
  );
}
