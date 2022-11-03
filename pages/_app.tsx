import '@fontsource/open-sans';
import '@fontsource/open-sans/700.css';
import '@fontsource/poppins';
import '@fontsource/poppins/700.css';
import axios from 'axios';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useState } from 'react';
import { responseTransformer } from '../axios/transformers';
import { Header } from '../components/Header';
import '../styles/globals.css';

axios.defaults.transformResponse = [responseTransformer];

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [isScrollDisabled, setIsScrollDisabled] = useState(false);
  const handleDisableScroll = () => {
    setIsScrollDisabled(!isScrollDisabled);
  };
  const showScroll = isScrollDisabled ? 'overflow-hidden' : 'overflow-auto';
  return (
    <SessionProvider session={session}>
      <div className={`min-h-screen flex flex-col ${showScroll}`}>
        {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <Script id="my-script" strategy="lazyOnload">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
          page_path: window.location.pathname,
          });
        `}
        </Script>
        <Script id="my-script-hotjar" strategy="lazyOnload">
          {`
          (function (h, o, t, j, a, r) {
            h.hj =
              h.hj ||
              function () {
                (h.hj.q = h.hj.q || []).push(arguments);
              };
            h._hjSettings = { hjid: 3161234, hjsv: 6 };
            a = o.getElementsByTagName('head')[0];
            r = o.createElement('script');
            r.async = 1;
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
            a.appendChild(r);
          })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
        `}
        
        </Script>
        <Header onMenuOpening={handleDisableScroll} />
        <Component {...pageProps} />
        <Script src="https://go.botmaker.com/rest/webchat/p/HLENDRUDLS/init.js" />
      </div>
    </SessionProvider>
  );
}
