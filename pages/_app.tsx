import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Header } from '../components/Header';
import '@fontsource/poppins';
import '@fontsource/poppins/700.css';
import '@fontsource/open-sans';
import '@fontsource/open-sans/700.css';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const handleDisableScroll = () => {
    setIsScrollDisabled(!isScrollDisabled);
  };
  const showScroll = isScrollDisabled ? 'overflow-hidden' : 'overflow-auto';
  return (
    <SessionProvider session={session}>
      <div className={`min-h-screen flex flex-col ${showScroll}`}>
        <Header onMenuOpening={handleDisableScroll} />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
