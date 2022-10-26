import {
  ChatAltIcon,
  InformationCircleIcon,
  LockClosedIcon,
  LoginIcon,
  LogoutIcon,
  MenuIcon,
  PlusCircleIcon
} from '@heroicons/react/outline';
import { UserRole } from '@prisma/client';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import DondeLogo from '../assets/images/DondeLogo.svg';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import { useClickOutsideHandler } from '../hooks/useClickOutsideHandler';
import { BackButton } from './BackButton';
import { Button } from './Button';
import MainContainer from './MainContainer';

export function Header({ onMenuOpening: handleMenuOpening }: { onMenuOpening: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const user = useAuthenticatedUser();
  const handleClickMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    handleMenuOpening();
  };
  const isHome = router.pathname === '/';
  // const isEstablishment = router.pathname.includes('establecimientos');
  const innerRef = useClickOutsideHandler<HTMLDivElement>(() => setIsMenuOpen(false));

  const SobreDondeButton = () => {
    return (
      <Button
        onClick={async () => {
          await router.push({ pathname: '/sobre-donde' });
          setIsMenuOpen(false);
        }}
        className={'border-ultra-light-gray lg:border-none text-primary lg:text-white '}
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
        className={'border-ultra-light-gray lg:border-none text-primary lg:text-white '}
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
        className={'border-ultra-light-gray lg:border-none text-primary lg:text-white '}
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
        className={'border-ultra-light-gray lg:border-none text-primary lg:text-white '}
        type={'tertiary'}
        alignment={'left'}
        icon={<LogoutIcon className={'h-6 w-5'} />}
      >
        Cerrar sesión
      </Button>
    );
  };

  const NewEstablishmentLink = () => {
    return (
      <Button
        onClick={async () => {
          await router.push({ pathname: '/establecimientos/nuevo' });
          setIsMenuOpen(false);
        }}
        className={'border-ultra-light-gray lg:border-none text-primary lg:text-white '}
        type={'tertiary'}
        alignment={'left'}
        icon={<PlusCircleIcon className={'h-6 w-5'} />}
      >
        Nuevo Establecimiento
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
        className={'border-ultra-light-gray lg:border-none text-primary lg:text-white '}
        type={'tertiary'}
        alignment={'left'}
        icon={<LockClosedIcon className={'h-6 w-5'} />}
      >
        Solicitudes
      </Button>
    );
  };

  return (
    <header >
      <div className='relative w-full'>
        <div className={'lg:flex hidden justify-end bg-primary h-9 w-full px-content'}>
            <SobreDondeButton />
            <PreguntasFrecuentesButton />
            {user?.role === UserRole.ADMIN && <AdminLink />}
            {user ? <LogoutButton /> : <LoginButton />}
        </div>
        <div className={'flex items-center py-3 px-content shadow-md shadow-slate-100'}>
          <div className={'mx-content'}>
            {!isHome && <BackButton />}
          </div>
          <Link href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <DondeLogo className={'translate-y-0.5'} />
            </a>
          </Link>

          <button onClick={handleClickMenu} className={'ml-auto lg:hidden flex'}>
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
                {user?.role === UserRole.ADMIN && <AdminLink />}
                {user ? <LogoutButton /> : <LoginButton />}
              </MainContainer>
            </div>
          )}
        </div>
      </div>   

    </header>
  );
}
