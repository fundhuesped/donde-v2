import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HTMLProps } from 'react';
import { Button } from '../components/Button';

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

export default function About() {
  return (
    <>
      <Head>
        <title>Dónde - Sobre Dónde</title>
      </Head>

      <main className={'px-6 my-2 lg:mx-auto lg:max-w-desktop'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>Sobre Dónde</h1>
        <p className={'text-base text-justify mb-6'}>
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
        <p>
          Es una plataforma de código abierto, disponible en:{' '}
          <FAQLink href=" https://github.com/fundhuesped/donde-huesped">Github</FAQLink>
        </p>
        <p className={'p-2 bg-ultra-light-salmon rounded-2xl text-center'}>
          Si tenés inquietudes, visitá nuestra sección de{' '}
          <Link href="/preguntas-frecuentes">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <span className={'text-primary font-bold'}>preguntas frecuentes</span>
            </a>
          </Link>
        </p>

        <ComenzarBusquedaButton />
      </main>
    </>
  );
}
