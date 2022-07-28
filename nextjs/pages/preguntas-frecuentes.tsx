import React, { HTMLProps, ReactNode, useState } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, QuestionMarkCircleIcon } from '@heroicons/react/outline';
import classNames from 'classnames';

const FAQLink = (props: HTMLProps<HTMLAnchorElement>) => {
  const { className, ...rest } = props;
  return <a className={classNames('text-primary', className)} {...rest} />;
};

type AccordionItemProps = {
  children?: ReactNode;
  title: ReactNode;
};
const AccordionItem = (props: AccordionItemProps) => {
  const { children, title } = props;
  const [open, setOpen] = useState(false);

  const ChevronIcon = open ? ChevronDownIcon : ChevronLeftIcon;

  return (
    <div className={'flex flex-col rounded-2xl border-2 w-full my-4'}>
      <a className={'py-4 flex flex-row w-full cursor-pointer'} onClick={() => setOpen(!open)}>
        <QuestionMarkCircleIcon className={'h-6 w-5 text-primary mx-4'} />
        <p className={'text-l font-title text-black font-semibold'}>{title}</p>
        <div className={'ml-auto'}>
          <ChevronIcon className={'h-6 w-5 text-primary mx-4'} />
        </div>
      </a>
      {open && <div className="px-8 my-4">{children}</div>}
    </div>
  );
};

const ITEMS = [
  {
    title: '¿Cómo funciona Dónde?',
    content: (
      <>
        <p>Seleccioná los servicios que quieras encontrar. Después, escribí una ubicación o compartirla desde tu dispositivo.</p>
        <p>
          La plataforma te mostrará los resultados más cercanos a la dirección que indicaste. En ese momento, vas a poder
          modificar tu búsqueda con el botón de &quot;Filtrar&quot;.
        </p>
      </>
    ),
  },
  {
    title: '¿Cómo hago para sugerir un lugar?',
    content: (
      <p>
        Si conocés algún lugar que no está en la plataforma y que brinda alguno de estos servicios contactanos a:{' '}
        <FAQLink href="mailto: donde@huesped.org.ar">donde@huesped.org.ar</FAQLink>
      </p>
    ),
  },
  {
    title: '¿Qué hago si encuentro un error?',
    content: (
      <p>
        Si encontrás algún error en los datos publicados escribinos a:{' '}
        <FAQLink href="mailto: donde@huesped.org.ar">donde@huesped.org.ar</FAQLink>
      </p>
    ),
  },
  {
    title: '¿Qué es Fundación Huésped?',
    content: (
      <>
        <p>
          Fundación Huésped es una organización argentina que, desde 1989, trabaja en áreas de salud pública. Desde la
          organización se realizan investigaciones científicas y acciones de prevención y promoción de los derechos para
          garantizar el acceso a la salud y reducir el impacto de las enfermedades con foco en{' '}
          <FAQLink href="https://www.huesped.org.ar/informacion/vih/">VIH/sida</FAQLink>,{' '}
          <FAQLink href="https://www.huesped.org.ar/informacion/hepatitis/">hepatitis virales</FAQLink>, enfermedades prevenibles
          por <FAQLink href="https://www.huesped.org.ar/informacion/vacunas/">vacunas</FAQLink> y{' '}
          <FAQLink href="https://www.huesped.org.ar/informacion/otras-infecciones-de-transmision-sexual/">
            otras enfermedades transmisibles
          </FAQLink>
          , así como en{' '}
          <FAQLink href="https://www.huesped.org.ar/informacion/derechos-sexuales-y-reproductivos/">
            salud sexual y reproductiva
          </FAQLink>
          .
        </p>
        <p>
          Si querés contactarte con nosotros podés escribirnos por{' '}
          <FAQLink href="https://twitter.com/FundHuesped">Twitter</FAQLink>,{' '}
          <FAQLink href="https://www.instagram.com/fundhuesped/">Instagram</FAQLink>,{' '}
          <FAQLink href="https://www.facebook.com/FundHuesped">Facebook</FAQLink> o escribiéndonos un correo a{' '}
          <FAQLink href="mailto:info@huesped.org.ar">info@huesped.org.ar</FAQLink>
        </p>
      </>
    ),
  },
];

export default function FAQs() {
  return (
    <div className={'px-6 my-2'}>
      <h1 className={'text-lg text-black font-bold mb-8'}>Preguntas frecuentes</h1>
      <ul>
        {ITEMS.map((item, index) => (
          <li key={index}>
            <AccordionItem title={item.title}>{item.content}</AccordionItem>
          </li>
        ))}
      </ul>
    </div>
  );
}
