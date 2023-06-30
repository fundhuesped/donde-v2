import { KeyIcon, UserIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import MainContainer from '../components/MainContainer';
import Head from 'next/head';
import Link from 'next/link';
import { Modal } from '../components/Modal';

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email('El correo debe tener este formato ejemplo@correo.com').required('Por favor escriba su correo'),
  })
  .required();

const PasswordReset: NextPage = () => {
  const router = useRouter();
  const [response, setResponse] = useState(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const handleTokenEmail = async (data: FormValues) => {
    await fetch('/api/auth/reset-password', {
      body: JSON.stringify({
        email: data.email,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => {
      setResponse(resp.status);
      setShowModal(true);
      setError(resp.statusText);
    });
  };

  return (
    <>
      <Head>
        <title>Dónde - Recuperar Contraseña</title>
      </Head>

      <MainContainer className={'mt-6 pt-8 container mx-auto w-full lg:w-[35rem] md:max-h-[21rem] lg:rounded-b-3xl px-[3rem]'}>
        <h1 className="text-xl font-bold text-center">Recuperar Contraseña</h1>
        <form className={'mt-7'} onSubmit={handleSubmit(handleTokenEmail)}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-medium-gray">
              Correo electrónico
            </label>

            <div>
              <UserIcon style={{ margin: '.4em .5em .5em .7em', position: 'absolute', width: '1.2em' }} color="#E6334C" />
              <input {...register('email')} id="email" name="email" className="input-style placeholder-icon" placeholder="" />
              <p className="color-primary text-sm">{errors.email?.message}</p>
            </div>
          </div>
          <div className="mb-6">
            <button type="submit" className="btn-primary">
              Enviar correo de recuperación
            </button>
          </div>
          {showModal ? (
            response === 200 ? (
              <Modal showModal={showModal} className={'bg-modal-image bg-white'}>
                <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] rounded-b">
                  <h2 className="text-xl font-semibold p-2">¡Solo un paso más!</h2>
                  <p className="text-center p-5">
                    Se ha enviado un correo electrónico con instrucciones para reestablecer la contraseña. Por favor, revisar la
                    bandeja de entrada y seguir los pasos indicados. ¡Gracias por tu colaboración!
                  </p>
                  <button
                    className="btn-secondary my-5 cursor-pointer"
                    type="button"
                    onClick={() => {
                      router.push('/ingresar');
                    }}
                  >
                    Ingresar
                  </button>
                </div>
              </Modal>
            ) : (
              <Modal showModal={showModal} className={'bg-modal-image bg-white'}>
                <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] rounded-b">
                  <h2 className="text-xl font-semibold p-2">Un momento...</h2>
                  <p className="text-center p-5">
                    El correo electrónico proporcionado no existe en nuestra base de datos de colaboración. Sin embargo, te
                    invitamos a continuar y solicitar una nueva cuenta para colaborar en Dónde.
                  </p>
                  <button
                    className="btn-secondary my-5 cursor-pointer"
                    type="button"
                    onClick={() => {
                      router.push('/registro');
                    }}
                  >
                    Solicitar cuenta
                  </button>
                </div>
              </Modal>
            )
          ) : null}
        </form>
      </MainContainer>
    </>
  );
};

export default PasswordReset;
