import { yupResolver } from '@hookform/resolvers/yup';
import { OrganizationType } from '@prisma/client';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import MainContainer from './MainContainer';
import { Modal } from './Modal';
import countries from '../utils/countries';
import roles from '../utils/roles';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizationName: string;
  organizationType: string;
  organizationRole: string;
  organizationCountry: string;
  organizationWebsite: string | null;
  role: string;
};

type UserInfoType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  organizationName?: string;
  organizationType?: string;
  organizationRole?: string;
  organizationCountry?: string;
  organizationWebsite?: string | null;
  role?: string;
  userId?: string;
  status?: string;
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
  role: '',
};

const userInfoValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  organizationName: '',
  organizationType: '',
  organizationRole: '',
  organizationCountry: '',
  organizationWebsite: '',
  role: '',
  userId: '',
  status: '',
}

const schema = yup
  .object({
    email: yup.string().email('El correo debe tener este formato ejemplo@correo.com').required('Por favor escriba su correo'),
    firstName: yup.string().required('Por favor escriba su nombre'),
    lastName: yup.string().required('Por favor escriba su apellido'),
    organizationName: yup.string().required('El nombre de la organización es requerido'),
    organizationType: yup.string().required('El tipo de organización es requerido'),
    organizationRole: yup.string().required('Por favor escriba su rol'),
    organizationCountry: yup.string().required('Por favor escriba el pais de la organización'),
    role: yup.string().required('Por favor seleccione un rol para el usuario'),
  })
  .required();

interface UserInfoProps {
  currentUser?: UserInfoType | null | undefined,
  isNewUser?: boolean,
  handleCloseAllModals?: () => void,
}

const UserInfo = (props: UserInfoProps) => {
  const { currentUser, isNewUser, handleCloseAllModals } = props;
  const router = useRouter();
  const [currentUserInfo, setCurrentUserInfo] = useState<UserInfoType>(userInfoValues);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [response, setResponse] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: currentUser ? currentUser : defaultValues,
  });

  const handleSignUp = async (data: FormValues) => {
    if (isNewUser) {
        await fetch('/api/admin/registros/nuevo', {
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
            userRole: data.role,
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
      } else {
        await fetch(`/api/admin/registros/${currentUserInfo.userId}`, {
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
            userRole: data.role,
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
      }
  };

  useEffect(() => {
    if (currentUser) {
      setCurrentUserInfo(currentUser);
    }
    if (response) {
      setShowModal(true);
      console.log('Enviado con exito');
    }
  }, [setResponse, response, currentUser]);

  return (
    <>
      <Head>
        <title>Dónde - Registro</title>
      </Head>

      <MainContainer className={'mt-6 p-5 container mx-auto w-full lg:w-[55em] lg:max-h-[38em] px-[3rem]'}>
        <form className={'px-5'} onSubmit={handleSubmit(handleSignUp)}>
          <h1 className="text-xl font-bold mb-4 text-center">{isNewUser ? 'Alta de Usuarie' : 'Editar Usuario'}</h1>
          {isNewUser && <p className="text-sm text-center">
            Para dar de alta un usuarie de <b>Dónde</b> complete el siguiente formulario para crear su cuenta.
          </p>}
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
                  value={currentUserInfo ? currentUserInfo.firstName : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, firstName: event.currentTarget.value})}
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
                  value={currentUserInfo ? currentUserInfo.lastName : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, lastName: event.currentTarget.value})}
                />
              </label>
              <p className="color-primary text-sm">{errors.lastName?.message}</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 my-6">
            <div className={`w-full ${isNewUser ? 'md:w-1/2' : 'md:w-full'} px-3 mb-6 md:mb-0`}>
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
                  value={currentUserInfo ? currentUserInfo.email : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, email: event.currentTarget.value})}
                />
              </label>
              <p className="color-primary text-sm">{errors.email?.message}</p>
            </div>
            {isNewUser && <div className="w-full md:w-1/2 px-3">
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
            </div>}
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
                  value={currentUserInfo ? currentUserInfo.organizationName : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, organizationName: event.currentTarget.value})}
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
                  value={currentUserInfo ? currentUserInfo.organizationRole : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, organizationRole: event.currentTarget.value})}
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
                  value={currentUserInfo ? currentUserInfo.organizationType : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, organizationType: event.currentTarget.value})}
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
                País de la Organización
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
                  value={currentUserInfo ? currentUserInfo.organizationCountry : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, organizationCountry: event.currentTarget.value})}
                >
                  <option value="" disabled hidden>
                    Elija un país
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
                Sitio web o RSS de la organización
                <input
                  className="input-style"
                  placeholder=""
                  id="organizationWebsite"
                  name="organizationWebsite"
                  value={currentUserInfo && currentUserInfo.organizationWebsite !== null ? currentUserInfo.organizationWebsite : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, organizationWebsite: event.currentTarget.value})}
                />
              </label>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="">
                Rol del Usuarie
                {!dirtyFields.organizationCountry ? (
                  <span style={{ color: '#E6334C', marginLeft: '0.25em', position: 'absolute', width: '1.2em' }}>*</span>
                ) : (
                  ''
                )}
                <select
                  {...register('role')}
                  className="input-style"
                  placeholder=""
                  id="role"
                  name="role"
                  value={currentUserInfo ? currentUserInfo.role : ''}
                  onChange={(event) => setCurrentUserInfo({...currentUserInfo, role: event.currentTarget.value})}
                >
                  <option className="text-gray-300" value="" disabled hidden>
                    Elija un rol
                  </option>
                  {roles.map((role) => (
                    <option key={`role-${role.name}`} value={role.value}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              <p className="color-primary text-sm">{errors.role?.message}</p>
            </div>
          </div>
          <div className="m-3">
            {!response && error != '' && <p className="color-primary">Algo salió mal, vuelve a intentar.(Error: {error})</p>}
          </div>
          <div className="pb-4 lg:pt-3">
            <button type="submit" className="btn-primary">
              {isNewUser ? 'Crear' : 'Actualizar'} Usuarie
            </button>
          </div>
          {showModal ? (
            isNewUser ? (
              <Modal showModal={showModal} className={'bg-modal-image bg-white'}>
                <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] rounded-b">
                  <h2 className="text-xl font-semibold p-2">¡Gracias por tu registro!</h2>
                  <p className="text-center p-5">Podes revisar el detalle del usuarie yendo a la lista de usuaries</p>
                  <button
                    className="btn-secondary my-5 cursor-pointer"
                    type="button"
                    onClick={() => {
                      router.push('/admin/solicitudes');
                    }}
                  >
                    Lista de Usuaries
                  </button>
                </div>
              </Modal>
            ) : (
              <Modal showModal={showModal}>
                <div className="flex items-center justify-center flex-col px-[5rem] py-[1.5rem] rounded-b">
                  <h2 className="text-xl font-semibold p-2">¡Usuarie actualizado con éxito!</h2>
                  <p className="text-center p-5">Podes revisar el detalle del usuarie yendo a la lista de usuaries</p>
                  <button
                    className="btn-secondary my-5 cursor-pointer"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      handleCloseAllModals?.();
                    }}
                  >
                    Cerrar
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

export default UserInfo;
