import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { Header } from '../components/Header';
import '@fontsource/poppins';
import '@fontsource/poppins/700.css';
import '@fontsource/open-sans';
import '@fontsource/open-sans/700.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const handleDisableScroll = () => {
    setIsScrollDisabled(!isScrollDisabled);
  };
  const showScroll = isScrollDisabled ? 'overflow-hidden' : 'overflow-auto';
  return (
    <div className={`min-h-screen flex flex-col ${showScroll}`}>
      <Header onMenuOpening={handleDisableScroll} />
      <Component {...pageProps} />
    </div>
  );
}
