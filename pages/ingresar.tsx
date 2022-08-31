import { KeyIcon, UserIcon } from '@heroicons/react/solid';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import MainContainer from '../components/MainContainer';

type FormValues = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().email('El correo debe tener este formato ejemplo@correo.com').required('Por favor escriba su correo'),
    password: yup.string().required('Por favor escriba su contraseña'),
  })
  .required();

const SignIn: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const handleSignIn = async (data: FormValues) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.error && res?.status === 401) {
      setError('Los datos ingresados son incorrectos.');
    } else {
      await router.push('/');
    }
  };

  return (
    <MainContainer className={'mt-6 pt-8 container mx-auto w-full lg:w-[35rem] md:max-h-[28rem] lg:rounded-b-3xl px-[3rem]'}>
      <h1 className="text-xl font-bold text-center">Ingresar</h1>
      <form className={'mt-7'} onSubmit={handleSubmit(handleSignIn)}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Correo electrónico
          </label>

          <div>
            <UserIcon style={{ margin: '.4em .5em .5em .7em', position: 'absolute', width: '1.2em' }} color="#E6334C" />
            <input
              {...register('email')}
              id="email"
              name='email'
              className="input-style placeholder-icon"
              placeholder="Nombre de usuario"              
            />
            <p className="color-primary text-sm">{errors.email?.message}</p>
          </div>
        </div>
        <div className="mb-8">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Contraseña
          </label>
          <div>
            <KeyIcon style={{ margin: '.4em .5em .5em .7em', position: 'absolute', width: '1.2em' }} color="#E6334C" />
            <input
              {...register('password')}
              type="password"
              id="password"
              name="password"
              className="input-style placeholder-icon"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            />
            <p className="color-primary text-sm">{errors.password?.message}</p>
            {error && <p className="color-primary text-sm mt-4">{error}</p>}
          </div>
          <small className={'flex justify-end pt-3 color-primary font-bold'}>¿Olvidaste la contraseña?</small>
        </div>
        <div className="mb-6">
          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
        </div>
        <small className={'flex justify-center'}>
          ¿No tienes cuenta?{' '}
          <button
            className="ml-2 color-primary font-bold"
            onClick={async () => {
              await router.push('/registro');
            }}
          >
            Solicitar
          </button>
        </small>
      </form>
    </MainContainer>
  );
};

export default SignIn;
