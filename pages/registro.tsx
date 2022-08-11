import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
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
  organizationType: string;
  organizationRol: string;
  organizationCountry: string;
  webSite: string;
};

const schema = yup
  .object({
    email: yup.string().email('El correo debe tener este formato ejemplo@correo.com').required('Por favor escriba su correo'),
    firstName: yup.string().required('Por favor escriba su nombre'),
    lastName: yup.string().required('Por favor escriba su apellido'),
    organizationType: yup.string().required('El tipo de organización es requerido'),
    organizationRol: yup.string().required('Por favor escriba su rol'),
    organizationCountry: yup.string().required('Por favor escriba el pais de la organización'),
    webSite: yup.string().required('Por favor escriba el sitio web de su organización'),
  })
  .required();

const SignUp: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [organizationRol, setOrganizationRol] = useState('');
  const [organizationCountry, setOrganizationCountry] = useState('');
  const [email, setEmail] = useState('');
  const [webSite, setWebSite] = useState('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const handleSignUp = async () => {
    const data = {
      email,
      firstName,
      lastName,
      organizationType,
      organizationRol,
      organizationCountry,
      webSite,
    };

    await fetch('/api/auth/signup', {
      body: JSON.stringify({ data }),
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
      {session && `Hola ${session.user?.email}`}
      <form className={'px-5'} onSubmit={handleSubmit(handleSignUp)}>
        <h1 className="text-xl font-bold mb-4 text-center">Registro</h1>
        <p className="text-sm text-center">
          Para ser colaboradore de <b>Dónde</b> y poder agregar establicientos dentro de la aplicación, complete el siguiente
          formulario para solicitar una cuenta.
        </p>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {firstName == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 4.2em', position: 'absolute', width: '1.2em' }}>*</p>
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
            {firstName == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 4.2em', position: 'absolute', width: '1.2em' }}>*</p>
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
            {organizationType == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 9.2em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <select
              {...register('organizationType')}
              className="select-style"
              placeholder="Tipo de organización"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
            >
              <option value="" disabled selected hidden>
                Tipo de organización
              </option>
              <option>Organización social</option>
              <option>Institución pública</option>
              <option>Institución privada</option>
              <option>Otro</option>
            </select>
            <p className="color-primary text-sm">{errors.organizationType?.message}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            {organizationRol == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 9.6em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('organizationRol')}
              className="input-style"
              placeholder="Rol en la organización"
              value={organizationRol}
              onChange={(e) => setOrganizationRol(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.organizationRol?.message}</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-6">
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
            >
              <option className="text-gray-300" value="" disabled selected hidden>
                País de la organización
              </option>
              {countries.map((country) => (
                <option key={`country-${country}`}>{country}</option>
              ))}
            </select>
            <p className="color-primary text-sm">{errors.organizationCountry?.message}</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            {email == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 8.4em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              className="input-style"
              placeholder="Correo electrónico"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
            <p className="color-primary text-sm">{errors.email?.message}</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {webSite == '' ? (
              <p style={{ color: '#E6334C', margin: '.2em .5em .5em 15em', position: 'absolute', width: '1.2em' }}>*</p>
            ) : (
              ''
            )}
            <input
              {...register('webSite')}
              className="input-style"
              placeholder="Sitio web o RRSS de la organización"
              value={webSite}
              onChange={(e) => setWebSite(e.target.value)}
            ></input>
            <p className="color-primary text-sm">{errors.webSite?.message}</p>
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
          <Modal showModal={showModal} background={"url('../assets/images/bg-modal.png') white"}>
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
