import { ChatAltIcon, InformationCircleIcon, LockClosedIcon, LoginIcon, LogoutIcon, MenuIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DondeLogo from '../assets/images/DondeLogo.svg';
import { useClickOutsideHandler } from '../hooks/useClickOutsideHandler';
import { BackButton } from './BackButton';
import { Button } from './Button';
import MainContainer from './MainContainer';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { signOut } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export function Header({ onMenuOpening: handleMenuOpening }: { onMenuOpening: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const user = useAuthenticatedUser();
  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    handleMenuOpening();
  };
  const isHome = router.pathname === '/';
  const innerRef = useClickOutsideHandler<HTMLDivElement>(() => setIsMenuOpen(false));

  const SobreDondeButton = () => {
    return (
      <Button
        onClick={async () => {
          await router.push({ pathname: '/sobre-donde' });
          setIsMenuOpen(false);
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
        onClick={async () => {
          await router.push({ pathname: '/preguntas-frecuentes' });
          setIsMenuOpen(false);
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

  const LoginButton = () => {
    return (
      <Button
        onClick={async () => {
          await router.push({ pathname: '/ingresar' });
          setIsMenuOpen(false);
        }}
        className={'border-ultra-light-gray'}
        type={'tertiary'}
        alignment={'left'}
        icon={<LoginIcon className={'h-6 w-5'} />}
      >
        Iniciar sesión
      </Button>
    );
  };

  const LogoutButton = () => {
    return (
      <Button
        onClick={async () => {
          await signOut();
          setIsMenuOpen(false);
        }}
        className={'border-ultra-light-gray'}
        type={'tertiary'}
        alignment={'left'}
        icon={<LogoutIcon className={'h-6 w-5'} />}
      >
        Cerrar sesión
      </Button>
    );
  };

  const AdminLink = () => {
    return (
      <Button
        onClick={async () => {
          await router.push({ pathname: '/admin/solicitudes' });
          setIsMenuOpen(false);
        }}
        className={'border-ultra-light-gray'}
        type={'tertiary'}
        alignment={'left'}
        icon={<LockClosedIcon className={'h-6 w-5'} />}
      >
        Admin
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
        <div className={'absolute min-h-full w-full left-0 top-10 flex lg:max-w-[20%] lg:left-auto lg:right-0'}>
          <MainContainer ref={innerRef} className={'z-50 mt-6 pt-6'}>
            {user && (
              <h3 className={'text-lg text-primary font-bold ml-4 mb-4'}>
                ¡Hola {user.firstName} {user.lastName}!
              </h3>
            )}
            <SobreDondeButton />
            <PreguntasFrecuentesButton />
            {user ? <LogoutButton /> : <LoginButton />}
            {user?.role === UserRole.ADMIN && <AdminLink />}
          </MainContainer>
        </div>
      )}
    </header>
  );
}
