import React, { useState } from 'react';
import { QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/outline';
import parse from 'html-react-parser';
type AccordionItem = {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
};
const Faq = () => {
  const FAQItems = [
    {
      id: '1',
      title: '¿Cómo funciona Dónde?',
      content: '<p className="px-8 my-4">Seleccioná los servicios que quieras encontrar. Después, escribí una ubicación o compartirla desde tu dispositivo.\n La plataforma te mostrará los resultados más cercanos a la dirección que indicaste. En ese momento, vas a poder modificar tu búsqueda con el botón de “Filtrar”.</p>',
      isOpen: false,
    },
    {
      id: '2',
      title: '¿Cómo hago para sugerir un lugar?',
      content: '<p className="px-8 my-4"> Si conocés algún lugar que no está en la plataforma y que brinda alguno de estos servicios contactanos a: <a classname="underline decoration-blue-800 text-blue-800" href="mailto: donde@huesped.org.ar">donde@huesped.org.ar</a></p>',
      isOpen: false,
    },
    {
      id: '3',
      title: '¿Qué hago si encuentro un error?',
      content: '<p className="px-8 my-4"}> Si encontrás algún error en los datos publicados escribinos a: <a classname="underline decoration-blue-800 text-blue-800" href="mailto: donde@huesped.org.ar">donde@huesped.org.ar</a></p>',
      isOpen: false,
    },
    {
      id: '4',
      title: '¿Qué es Fundación Huésped?',
      content: '<p className="px-8 my-4\">Fundación Huésped es una organización argentina que, desde 1989, trabaja en áreas de salud pública. Desde la organización se realizan investigaciones científicas y acciones de prevención y promoción de los derechos para garantizar el acceso a la salud y reducir el impacto de las enfermedades con foco en <a classname="underline decoration-blue-800 text-blue-800" href="https://www.huesped.org.ar/informacion/vih/">VIH/sida</a>, <a classname="underline decoration-blue-800 text-blue-800" href="https://www.huesped.org.ar/informacion/hepatitis/">hepatitis virales</a>, enfermedades prevenibles por <a classname="underline decoration-blue-800 text-blue-800" href="https://www.huesped.org.ar/informacion/vacunas/">vacunas</a> y <a classname="underline decoration-blue-800 text-blue-800" href="https://www.huesped.org.ar/informacion/otras-infecciones-de-transmision-sexual/">otras enfermedades transmisibles</a>, así como en <a classname="underline decoration-blue-800 text-blue-800" href="https://www.huesped.org.ar/informacion/derechos-sexuales-y-reproductivos/">salud sexual y reproductiva</a>.\n Si querés contactarte con nosotros podés escribirnos por <a classname="underline decoration-blue-800 text-blue-800" href="https://twitter.com/FundHuesped">Twitter</a>, <a href="https://www.instagram.com/fundhuesped/">Instagram</a>, <a classname="underline decoration-blue-800 text-blue-800" href="https://www.facebook.com/FundHuesped">Facebook</a> o escribiéndonos un correo a <a href="mailto:info@huesped.org.ar">info@huesped.org.ar</a></p>',
      isOpen: false,
    },
  ];
  const [items, setItems] = useState<AccordionItem[]>(FAQItems);
  const handleItemClicked = (itemId: string) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    });
    setItems(updatedItems);
  };
  return (
    <div className={'px-6 my-2'}>
      <h1 className={'text-lg text-black font-bold mb-8'}>Preguntas frecuentes</h1>
      <ul>
        {items.map((item: AccordionItem, index) => (
          <li key={item.id}>
            <button
              className={'flex flex-col justify-center rounded-2xl border-2 w-full my-4'}
              onClick={() => handleItemClicked(item.id)}
            >
              <div className={'py-4 flex flex-row'}>
                <QuestionMarkCircleIcon className={'h-6 w-5 text-primary mx-4'} />
                <p className={'text-l font-title text-black font-semibold'}>{item.title}</p>
                <ChevronDownIcon className={'h-6 w-5 text-primary mx-4'} />
              </div>
              {item.isOpen &&  parse(item.content)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faq;
