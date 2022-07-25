import React, { useState } from 'react';
import { ChatAltIcon, InformationCircleIcon, MenuIcon } from '@heroicons/react/outline';
import { ReactComponent as DondeLogo } from './assets/images/DondeLogo.svg';
import { Button } from './components/Button';
import MainContainer from './components/MainContainer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BackButton } from './components/BackButton';
import { useClickOutsideHandler } from './hooks/useClickOutsideHandler';

export function Header({ onMenuOpening: handleMenuOpening }: { onMenuOpening: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    handleMenuOpening();
  };
  const handleClickMenuItem = (route: string) => {
    setIsMenuOpen(false);
    navigate(route);
  };
  const location = useLocation();
  const isHome = location.pathname === '/';
  const innerRef = useClickOutsideHandler<HTMLDivElement>(() => setIsMenuOpen(false));
  return (
    <header className={'flex items-center py-5 px-content'}>
      {!isHome && <BackButton />}
      <Link
        to={'/'}
        onClick={() => {
          setIsMenuOpen(false);
        }}
      >
        <DondeLogo className={'translate-y-0.5'} />
      </Link>
      <button onClick={handleClickMenu} className={'ml-auto'}>
        <MenuIcon className="w-6 text-dark-gray" />
      </button>
      {isMenuOpen && (
        <div className={'absolute min-h-full w-full left-0 top-10 flex'}>
          <MainContainer ref={innerRef} className={'z-50 pt-6'}>
            <Button
              onClick={() => handleClickMenuItem('/sobre-donde')}
              className={'border-ultra-light-gray '}
              type={'tertiary'}
              alignment={'left'}
              icon={<InformationCircleIcon className={'h-6 w-5'} />}
            >
              Sobre Dónde
            </Button>

            <Button
              onClick={() => handleClickMenuItem('/faq')}
              className={'border-ultra-light-gray'}
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
