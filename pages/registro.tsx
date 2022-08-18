import { yupResolver } from '@hookform/resolvers/yup';
import { OrganizationType } from '@prisma/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import MainContainer from '../components/MainContainer';
import { Modal } from '../components/Modal';

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

const schema = yup
  .object({
    email: yup.string().email('El correo debe tener este formato ejemplo@correo.com').required('Por favor escriba su correo'),
    firstName: yup.string().required('Por favor escriba su nombre'),
    lastName: yup.string().required('Por favor escriba su apellido'),
    organizationName: yup.string().required('El nombre de la organización es requerido'),
    organizationType: yup.string().required('El tipo de organización es requerido'),
    organizationRole: yup.string().required('Por favor escriba su rol'),
    organizationCountry: yup.string().required('Por favor escriba el pais de la organización'),
    organizationWebsite: yup.string().required('Por favor escriba el sitio web de su organización'),
  })
  .required();

const SignUp: NextPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [organizationRole, setOrganizationRol] = useState('');
  const [organizationCountry, setOrganizationCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationWebsite, setOrganizationWebsite] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const handleSignUp = async () => {
    await fetch('/api/auth/signup', {
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        password,
        organizationName,
        organizationType,
        organizationRole,
        organizationCountry,
        organizationWebsite,
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

  const countries = [
    'Argentina',
    'Bolivia',
    'Brasil',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Ecuador',
    'El Salvador',
    'Guayana Francesa',
    'Granada',
    'Guatemala',
    'Guayana',
    'Haití',
    'Honduras',
    'Jamaica',
    'México',
    'Nicaragua',
    'Paraguay',
    'Panamá',
    'Perú',
    'Puerto Rico',
    'República Dominicana',
    'Surinam',
    'Uruguay',
    'Venezuela',
  ];

  return (
    <MainContainer className={'mt-6 p-5 container mx-auto w-full lg:w-[55em] lg:max-h-[32em] px-[3rem]'}>
      <form className={'px-5'} onSubmit={handleSubmit(handleSignUp)}>
        <h1 className="text-xl font-bold mb-4 text-center">Registro</h1>
        <p className="text-sm text-center">
          Para ser colaboradore de <b>Dónde</b> y poder agregar establicientos dentro de la aplicación, complete el siguiente
          formulario para solicitar una cuenta.
        </p>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {firstName == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 4em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('firstName')}
              className="input-style"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.firstName?.message}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            {lastName == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 4em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('lastName')}
              className="input-style"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.lastName?.message}</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {email == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 8.2em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('email')}
              className="input-style"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.email?.message}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            {password == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 5.3em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('password')}
              type="password"
              className="input-style"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.lastName?.message}</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3">
            {organizationName == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 11.8em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('organizationName')}
              className="input-style"
              placeholder="Nombre de la organización"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.organizationName?.message}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            {organizationRole == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 9.6em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('organizationRole')}
              className="input-style"
              placeholder="Rol en la organización"
              value={organizationRole}
              onChange={(e) => setOrganizationRol(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.organizationRole?.message}</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {organizationType == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 9.4em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <select
              {...register('organizationType')}
              className="select-style"
              placeholder="Tipo de organización"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Tipo de organización
              </option>
              <option value={OrganizationType.SOCIAL_ORGANIZATION}>Organización social</option>
              <option value={OrganizationType.PUBLIC_INSTITUTION}>Institución pública</option>
              <option value={OrganizationType.PRIVATE_INSTITUTION}>Institución privada</option>
              <option value={OrganizationType.OTHER}>Otro</option>
            </select>
            <p className="color-primary text-sm">{errors.organizationType?.message}</p>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {organizationCountry == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 10.2em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <select
              {...register('organizationCountry')}
              className="input-style select-style"
              placeholder="País de la organización"
              value={organizationCountry}
              onChange={(e) => setOrganizationCountry(e.target.value)}
              defaultValue=""
            >
              <option className="text-gray-300" value="" disabled hidden>
                País de la organización
              </option>
              {countries.map((country) => (
                <option key={`country-${country}`}>{country}</option>
              ))}
            </select>
            <p className="color-primary text-sm">{errors.organizationCountry?.message}</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {organizationWebsite == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 15em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('organizationWebsite')}
              className="input-style"
              placeholder="Sitio web o RRSS de la organización"
              value={organizationWebsite}
              onChange={(e) => setOrganizationWebsite(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.organizationWebsite?.message}</p>
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
  );
};

export default SignUp;
