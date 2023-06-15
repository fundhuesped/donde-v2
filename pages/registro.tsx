import { yupResolver } from '@hookform/resolvers/yup';
import { OrganizationType } from '@prisma/client';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import MainContainer from '../components/MainContainer';
import { Modal } from '../components/Modal';
import countries from '../utils/countries';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
  organizationType: string;
  organizationRole: string;
  organizationCountry: string;
  organizationWebsite: string;
};

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  organizationName: '',
  organizationType: '',
  organizationRole: '',
  organizationCountry: '',
  organizationWebsite: '',
};

const schema = yup
  .object({
    email: yup.string().email('El correo debe tener este formato ejemplo@correo.com').required('Por favor escriba su correo'),
    firstName: yup.string().required('Por favor escriba su nombre'),
    lastName: yup.string().required('Por favor escriba su apellido'),
    organizationName: yup.string().required('El nombre de la organización es requerido'),
    organizationType: yup.string().required('El tipo de organización es requerido'),
    organizationRole: yup.string().required('Por favor escriba su rol'),
    organizationCountry: yup.string().required('Por favor escriba el pais de la organización'),
  })
  .required();

const SignUp: NextPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const handleSignUp = async (data: FormValues) => {
    await fetch('/api/auth/signup', {
      body: JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        organizationRole: data.organizationRole,
        organizationCountry: data.organizationCountry,
        organizationWebsite: data.organizationWebsite,
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
  };

  useEffect(() => {
    if (response) {
      setShowModal(true);
      console.log('Enviado con exito');
    }
  }, [setResponse, response]);

  return (
    <>
      <Head>
        <title>Dónde - Registro</title>
      </Head>

      <MainContainer className={'mt-6 p-5 container mx-auto w-full lg:w-[55em] lg:max-h-[38em] px-[3rem]'}>
        <form className={'px-5'} onSubmit={handleSubmit(handleSignUp)}>
          <h1 className="text-xl font-bold mb-4 text-center">Registro</h1>
          <p className="text-sm text-center">
            Para colaborar con <b>Dónde</b> y poder agregar establecimientos dentro de la aplicación, complete el siguiente
            formulario para solicitar una cuenta.
          </p>
          <div className="flex flex-wrap -mx-3 my-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="">
                Nombre
                {!dirtyFields.firstName ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <input
                  {...register('firstName')}
                  className="input-style"
                  placeholder=""
                  id="firstName"
                  name="firstName"
                />
              </label>
              <p className="color-primary text-sm">{errors.firstName?.message}</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="">
                Apellido
                {!dirtyFields.lastName ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <input
                  {...register('lastName')}
                  className="input-style"
                  placeholder=""
                  id="lastName"
                  name="lastName"
                />
              </label>
              <p className="color-primary text-sm">{errors.lastName?.message}</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 my-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="">
                Correo Electrónico
                {!dirtyFields.email ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <input
                  {...register('email')}
                  className="input-style"
                  placeholder=""
                  id="email"
                  name="email"
                />
              </label>
              <p className="color-primary text-sm">{errors.email?.message}</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="">
              Contraseña
                {!dirtyFields.password ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <input
                  {...register('password')}
                  type="password"
                  className="input-style"
                  placeholder=""
                  id="password"
                  name="password"
                />
              </label>
              <p className="color-primary text-sm">{errors.lastName?.message}</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 my-6">
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="">
                Nombre de la Organización
                {!dirtyFields.organizationName ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <input
                  {...register('organizationName')}
                  className="input-style"
                  placeholder=""
                  id="organizationName"
                  name="organizationName"
                />
              </label>
              <p className="color-primary text-sm">{errors.organizationName?.message}</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="">
                Rol en la Organización
                {!dirtyFields.organizationRole ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <input
                  {...register('organizationRole')}
                  className="input-style"
                  placeholder=""
                  id="organizationRole"
                  name="organizationRole"
                />
              </label>
              <p className="color-primary text-sm">{errors.organizationRole?.message}</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 my-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="">
                Tipo de Organización
                {!dirtyFields.organizationType ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <select
                  {...register('organizationType')}
                  className="input-style"
                  placeholder=""
                  id="organizationType"
                  name="organizationType"
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Elija un tipo
                  </option>
                  <option value={OrganizationType.SOCIAL_ORGANIZATION}>Organización social</option>
                  <option value={OrganizationType.PUBLIC_INSTITUTION}>Institución pública</option>
                  <option value={OrganizationType.PRIVATE_INSTITUTION}>Institución privada</option>
                  <option value={OrganizationType.OTHER}>Otro</option>
                </select>
              </label>
              <p className="color-primary text-sm">{errors.organizationType?.message}</p>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="">
                Elija un país
                {!dirtyFields.organizationCountry ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <select
                  {...register('organizationCountry')}
                  className="input-style"
                  placeholder=""
                  id="organizationCountry"
                  name="organizationCountry"
                  defaultValue=""
                >
                  <option className="text-gray-300" value="" disabled hidden>
                    País de la organización
                  </option>
                  {countries.map((country) => (
                    <option key={`country-${country.code}`} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <p className="color-primary text-sm">{errors.organizationCountry?.message}</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 my-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="">
                Sitio Web o RSS de la Organización
                <input
                  className="input-style"
                  placeholder=""
                  id="organizationWebsite"
                  name="organizationWebsite"
                />
              </label>
            </div>
          </div>
          <div className="m-3">
            {!response && error != '' && <p className="color-primary">Algo salió mal, vuelve a intentar.(Error: {error})</p>}
          </div>
          <div className="pb-4 lg:pt-3">
            <button type="submit" className="btn-primary">
              Enviar solicitud
            </button>
          </div>
          {showModal ? (
            <Modal showModal={showModal} className={'bg-modal-image bg-white'}>
              <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] rounded-b">
                <h2 className="text-xl font-semibold p-2">¡Gracias por ser parte!</h2>
                <p className="text-center p-5">Revisaremos los datos enviados y nos pondremos en contacto a la brevedad.</p>
                <button
                  className="btn-secondary my-5"
                  type="button"
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  Comenzar búsqueda
                </button>
              </div>
            </Modal>
          ) : null}
        </form>
      </MainContainer>
    </>
  );
};

export default SignUp;
