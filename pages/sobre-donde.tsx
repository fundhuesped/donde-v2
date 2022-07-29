import React from 'react';
import { Button } from '../components/Button';
import Link from 'next/link';
import Head from 'next/head';
import { router } from 'next/client';

function ComenzarBusquedaButton() {
  return <Button className={'w-full my-5'} type={'secondary'} onClick={ () => { router.push("/") } }>
    Comenzar Búsqueda
  </Button>;
}

export default function About() {
  return (
    <>
      <Head>
        <title>Dónde - Sobre Dónde</title>
      </Head>

      <main className={'px-6 my-2'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>Sobre Dónde</h1>
        <p className={'text-base text-justify mb-6'}>
          <strong>Dónde</strong> es una plataforma que te permite encontrar servicios de salud.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Buscá el lugar más cercano para acceder a preservativos, métodos anticonceptivos, información sobre interrupción
          voluntaria del embarazo, test de ITS, vacunatorios y centros de infectología.
        </p>
        <p className={'text-base text-justify mb-6'}>Esta es una plataforma de código abierto pensada por Fundación Huésped.</p>
        <p className={'p-2 bg-ultra-light-salmon rounded-2xl text-center'}>
          Si tienes inquietudes, visitá nuestra sección de{' '}
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
