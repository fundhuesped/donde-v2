import { NextPage } from 'next';
import { useEffect, useMemo, useRef, useState } from 'react';
import Tiptap from '../../components/TipTapEditor';
import axios from 'axios';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { Button } from '../../components/Buttons/Button';
import Loading from '../../components/Loading';

type AboutContentProps = {
  id?: string,
  text?: string,
}

export type FaqContentProps = {
  id?: string,
  question?: string,
  answer?: string,
}

const getAboutSectionContent = async (id?: string) => {
  return await axios.get('/api/content', {
    params: {
      id,
    }
  });
};

const setAboutSectionContent = async (id?: string, text?: string) => {
  return await axios.put('/api/admin/content',
    {
      id,
      text,
    },
    {
      params: {
        id
      },
    }
  )
}

const getFaqsSectionContent = async (id?: string) => {
  return await axios.get('/api/faq', {
    /* params: {
      id,
    } */
  });
};

const setFaqsSectionContent = async (id?: string, question?: string, answer?: string) => {
  return await axios.put('/api/admin/faq',
    {
      id,
      question,
      answer,
    },
    /* {
      params: {
        id
      },
    } */
  )
}

const newFaqsSectionContent = async (question?: string, answer?: string) => {
  return await axios.post('/api/admin/faq',
    {
      question,
      answer,
    },
    /* {
      params: {
        id
      },
    } */
  )
}

const removeFaqsSectionContent = async (id?: string) => {
  return await axios.delete('/api/admin/faq',
    {
      data: { id },
    }
  );
};

// @ts-ignore
const Contenido: NextPage = () => {
  const [aboutContent, setAboutContent] = useState<AboutContentProps[]>([]);
  const [faqContent, setFaqContent] = useState<FaqContentProps[]>([]);
  const [showNewFaq, setShowNewFaq] = useState<boolean>(false);
  const faqsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('sobre-donde');

  useEffect(() => {
    getAboutSectionContent('about').then((response) => {
      setAboutContent([...response.data]);
    });
    getFaqsSectionContent().then((response) => {
      setFaqContent([...response.data]);
    });
  }, []);

  const handleAddNewFaq = () => {
    setShowNewFaq(true);

    newFaqsSectionContent('Nueva Pregunta', 'Respuesta').then(() => {
      getFaqsSectionContent().then((response) => {
        setFaqContent([...response.data]);
        setShowNewFaq(false);
        if (faqsRef.current) {
          faqsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      });
    });
  };

  const handleRemoveFaq = (id: string) => {
    setShowNewFaq(true);

    removeFaqsSectionContent(id).then(() => {
      getFaqsSectionContent().then((response) => {
        setFaqContent([...response.data]);
        setShowNewFaq(false);

      });
    });
  }

  const handleTabClick = (tabId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveTab(tabId);
  };



  return (
    <div ref={faqsRef} className='w-3/4 mx-auto'>
      <h1 className="text-xl text-black font-bold mb-8 mt-8">Contenido</h1>
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 ">
        <li className="mr-2">
          <a
            href="#sobre-donde"
            aria-current="page"
            className={`inline-block p-4 rounded-t-lg ${activeTab === 'sobre-donde' ? 'active text-primary bg-gray-100' : ''
              }`}
            onClick={(event) => handleTabClick('sobre-donde', event)}
          >
            Sobre Dónde
          </a>
        </li>
        <li className="mr-2">
          <a
            href="#faq"
            className={`inline-block p-4 rounded-t-lg ${activeTab === 'faq' ? 'active text-primary bg-gray-100' : ''
              }`}
            onClick={(event) => handleTabClick('faq', event)}
          >
            FAQs
          </a>
        </li>
      </ul>
      <div id="sobre-donde" className={activeTab === 'sobre-donde' ? '' : 'hidden'}>
        <h2 className='text-lg text-black font-bold my-2'>Sobre Dónde</h2>
        {aboutContent && aboutContent.map((currentContent, index) => (
          <Tiptap key={index} id={currentContent.id} content={currentContent.text} callback={setAboutSectionContent} />
        ))}
      </div>
      <div id="faq" className={activeTab === 'faq' ? '' : 'hidden'}>
        <div className='flex justify-between'><h2 className='text-lg text-black font-bold my-2'>FAQs</h2>
          <Button
            className={'my-3 p-0'}
            type={'secondary'}
            onClick={handleAddNewFaq}
            icon={<PlusCircleIcon className={'h-6 w-5'} />}
          >
            Agregar FAQ
          </Button></div>
        {showNewFaq || !faqContent ?
          <div className="flex items-center justify-center h-32"> <Loading /></div>
          : (
            faqContent.map((faq, index) => {
              return (
                <div key={index}>
                  <div>
                    <Tiptap id={faq.id} content={faq.question} callback={setFaqsSectionContent} answer={faq.answer} faqContent={faqContent} onSetFaqContent={setFaqContent} />
                    <Tiptap id={faq.id} content={faq.answer} callback={setFaqsSectionContent} question={faq.question}  />
                  </div>
                  <div>
                    <button
                      className='my-5 mr-4 lg:max-w-sm px-3 font-bold lg:max-h-14 rounded-xl border border-primary text-white bg-primary'
                      onClick={() => faq.id && handleRemoveFaq(faq.id)}
                    >
                      Eliminar FAQ
                    </button>
                  </div>
                  <hr className='bg-primary mb-8' />
                </div>
              )
            }))
        }
      </div>

    </div>
  )
};

export default Contenido;