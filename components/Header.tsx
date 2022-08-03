import React, { useState } from 'react';
import { ChatAltIcon, InformationCircleIcon, MenuIcon } from '@heroicons/react/outline';
import DondeLogo from '../assets/images/DondeLogo.svg';
import { useClickOutsideHandler } from '../hooks/useClickOutsideHandler';
import { BackButton } from './BackButton';
import Link from 'next/link';
import MainContainer from './MainContainer';
import { Button } from './Button';
import { useRouter } from 'next/router';

export function Header({ onMenuOpening: handleMenuOpening }: { onMenuOpening: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    handleMenuOpening();
  };
  const isHome = router.pathname === '/';
  const innerRef = useClickOutsideHandler<HTMLDivElement>(() => setIsMenuOpen(false));

  const SobreDondeButton = () => {
    return (
      <Button
        onClick={() => {
          setIsMenuOpen(false);

          router.push({ pathname: '/sobre-donde' });
        }}
        className={'border-ultra-light-gray '}
        type={'tertiary'}
        alignment={'left'}
        icon={<InformationCircleIcon className={'h-6 w-5'} />}
      >
        Sobre Dónde
      </Button>
    );
  };

  const PreguntasFrecuentesButton = () => {
    return (
      <Button
        onClick={() => {
          setIsMenuOpen(false);

          router.push({ pathname: '/preguntas-frecuentes' });
        }}
        className={'border-ultra-light-gray'}
        type={'tertiary'}
        alignment={'left'}
        icon={<ChatAltIcon className={'h-6 w-5'} />}
      >
        Preguntas frecuentes
      </Button>
    );
  };

  return (
    <header className={'flex items-center py-5 px-content'}>
      {!isHome && <BackButton />}

      <Link href="/">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>
          <DondeLogo className={'translate-y-0.5'} />
        </a>
      </Link>

      <button onClick={handleClickMenu} className={'ml-auto'}>
        <MenuIcon className="w-6 text-dark-gray" />
      </button>

      {isMenuOpen && (
        <div className={'absolute min-h-full w-full left-0 top-10 flex'}>
          <MainContainer ref={innerRef} className={'z-50 mt-6 pt-6'}>
            <SobreDondeButton />

            <PreguntasFrecuentesButton />
          </MainContainer>
        </div>
      )}
    </header>
  );
}
