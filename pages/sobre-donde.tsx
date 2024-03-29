import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HTMLProps, useEffect, useState } from 'react';
import { Button } from '../components/Buttons/Button';
import axios from 'axios';

type ContentProps = {
  id?: string;
  text?: string;
};

const FAQLink = (props: HTMLProps<HTMLAnchorElement>) => {
  const { className, children, ...rest } = props;
  return (
    <a className={classNames('text-primary', className)} {...rest}>
      {children}
    </a>
  );
};

function ComenzarBusquedaButton() {
  const router = useRouter();
  return (
    <Button
      className={'w-full my-5 lg:mx-auto lg:max-w-sm'}
      type={'secondary'}
      onClick={() => {
        router.push('/');
      }}
    >
      Comenzar Búsqueda
    </Button>
  );
}

const getSectionContent = async (id: string) => {
  return await axios.get('/api/content', {
    params: {
      id,
    },
  });
};

export default function About() {
  const [content, setContent] = useState<ContentProps[]>();

  const handleHtml = (content: ContentProps) => {
    if (content.text) {
      return {
        __html: content.text,
      };
    }
  };

  useEffect(() => {
    getSectionContent('about').then((response) => {
      setContent(response.data);
    });
  }, []);

  return (
    <>
      <Head>
        <title>Dónde - Sobre Dónde</title>
      </Head>

      <main className={'px-6 my-2 lg:mx-auto lg:max-w-desktop'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>Sobre Dónde</h1>
        {content &&
          content.map((content, key) => <div key={key} className="" dangerouslySetInnerHTML={handleHtml(content)}></div>)}
        {/* <p className={'text-base text-justify mb-6'}>
          <strong>Dónde</strong> es una plataforma que te permite encontrar servicios de salud.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Buscá el lugar más cercano para acceder a preservativos, métodos anticonceptivos, información sobre interrupción
          voluntaria del embarazo, test de infecciones de transmisión sexual (ITS) y vacunatorios.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Fue creada por Fundación Huésped en 2013 desarrollada en varias etapas gracias al trabajo de muchas personas. El sitio
          actual fue hecho por Wingu.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Es una plataforma de código abierto, disponible en:{' '}
          <FAQLink href=" https://github.com/fundhuesped/donde-v2">Github.</FAQLink>
        </p>
        <p className={'text-base text-justify mb-6'}>
          Al recorrer y utilizar esta plataforma estás aceptando nuestras{' '}
          <FAQLink href=" https://www.huesped.org.ar/politica-de-privacidad">políticas de privacidad.</FAQLink>
        </p> */}
        <p className={'my-4 p-2 bg-ultra-light-salmon rounded-2xl text-center'}>
          Si tenés inquietudes, visitá nuestra sección de{' '}
          <Link href="/preguntas-frecuentes">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className={'text-primary font-bold cursor-pointer'}>Preguntas Frecuentes</span>
            </a>
          </Link>
        </p>

        <ComenzarBusquedaButton />
      </main>
    </>
  );
}
