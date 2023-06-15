import { KeyIcon, UserIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import MainContainer from '../components/MainContainer';
import Head from 'next/head';
import Link from 'next/link';
import { Modal } from '../components/Modal';
import { EyeIcon } from '@heroicons/react/outline';

type FormValues = {
  password: string;
};

const schema = yup
  .object({
    password: yup.string().required('Por favor escriba su contraseña'),
  })
  .required();

const PasswordNew: NextPage = () => {
  const router = useRouter();
  const [response, setResponse] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const handleNewPassword = async (data: FormValues) => {
    await fetch('/api/auth/recuperar', {
      body: JSON.stringify({
        email: router.query.email,
        password: data.password,
        token: router.query.token
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => {
      setResponse(true);
      // setResponse(resp.ok);
      setError(resp.statusText);
    });
    /* if (res?.error && res?.status === 401) {
      setError('Los datos ingresados son incorrectos.');
    } else {
      await router.push('/');
    } */
  };

  useEffect(() => {
    if (response) {
      setShowModal(true);
    }
  }, [response, setResponse])

  const handleShowPassword = (key: string) => {
    if (key === 'Enter') {
      setHidePassword(!hidePassword)  
    }
  }

  return (
    <>
      <Head>
        <title>Dónde - Ingresar</title>
      </Head>

      <MainContainer className={'mt-6 pt-8 container mx-auto w-full lg:w-[35rem] md:max-h-[28rem] lg:rounded-b-3xl px-[3rem]'}>
        <h1 className="text-xl font-bold text-center">Crea tu nueva contraseña</h1>
        <form className={'mt-7'} onSubmit={handleSubmit(handleNewPassword)}>
          <div className="mb-8 relative">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-medium-gray">
              Contraseña
            </label>
            <div className='relative'>
              <KeyIcon style={{ margin: '.4em .5em .5em .7em', position: 'absolute', width: '1.2em' }} color="#E6334C" />
              <input
                {...register('password')}
                type={hidePassword ? "password" : "text"}
                id="password"
                name="password"
                className="input-style placeholder-icon"
                placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              />
              <span
                className="absolute top-0 right-0 w-[30px] mr-2 mt-[2.5px] text-primary"
                role='button'
                tabIndex={0}
                onKeyUp={(event) => handleShowPassword(event.key)}
                onClick={() => setHidePassword(!hidePassword)}
              >
                <EyeIcon />
              </span>
              <p className="color-primary text-sm">{errors.password?.message}</p>
              {error && <p className="color-primary text-sm mt-4">{error}</p>}
            </div>
          </div>
          <div className="mb-6">
            <button type="submit" className="btn-primary">
              Cambiar Contraseña
            </button>
          </div>
          {showModal &&
            <Modal showModal={showModal} className={'bg-modal-image bg-white'}>
              <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] rounded-b">
                <h2 className="text-xl font-semibold p-2">¡Tu contraseña se recuperó correctamente!</h2>
                <p className="text-center p-5">Ahora podrás ingresar nuevamente para seguir utilizando Dónde</p>
                <button
                  className="btn-secondary my-5"
                  type="button"
                  onClick={() => {
                    router.push('/ingresar');
                  }}
                >
                  Ingresar a mi cuenta
                </button>
              </div>
            </Modal>
          }
        </form>
      </MainContainer>
    </>
  );
};

export default PasswordNew;
