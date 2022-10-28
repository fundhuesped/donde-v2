import { XIcon } from '@heroicons/react/outline';
import { Service, ServiceOnEstablishmentOpeningTime, Subservice } from '@prisma/client';
import axios from 'axios';
import _, { isNull } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { useRouter } from 'next/router';
import React, { RefObject, useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import MainContainer from '../../components/MainContainer';
import Select from '../../components/Select';
import { GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS } from '../../config/thirdParty';
import { establishmentTypes } from '../../model/establishment';
import Alert from '../Alert';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { AvailableServices } from './AvailableServices';
import { ContactInfoField } from './ContactInfoField';
import { EstablishmentSearchStep } from './EstablishmentSearchStep';
import { LocationField } from './LocationField';

export type EstablishmentModel = {
  id?: string;
  name: string;
  type: string;
  street: string;
  streetNumber: string | null;
  apartment: string | null;
  intersection: string | null;
  details: string | null;
  website: string | null;
  city: string;
  department: string;
  province: string;
  country: string;
  latitude?: number;
  longitude?: number;
  services: {
    id: string;
    serviceId: string;
    service: Service;
    subserviceId: string | null;
    subservice: Subservice | null;
    email: string | null;
    phoneNumber: string | null;
    details: string | null;
    openingTimes: ServiceOnEstablishmentOpeningTime[];
  }[];
  servicesId: Set<string>;
  fullAddress: string;
  phone: string;
  email: string;
  whatsApp: string;
  tosCheckbox: boolean;
  availability: string;
  address: string;
};
export const emptyEstablishmentModel = {
  name: '',
  address: '',
  street: '',
  streetNumber: '',
  type: 'PUBLIC_INSTITUTION',
  fullAddress: '',
  apartment: '',
  intersection: '',
  services: [],
  servicesId: new Set<string>(),
  website: '',
  phone: '',
  whatsApp: '',
  email: '',
  tosCheckbox: false,
  details: '',
  availability: '',
  country: '',
  province: '',
  city: '',
  department: '',
};

const EstablishmentAdmin = (props: {
  googleMapsApiKey: string;
  establishment?: EstablishmentModel;
  availableServices: Service[];
}) => {
  const { googleMapsApiKey, establishment, availableServices } = props;
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [isSearchStepCompleted, setIsSearchStepCompleted] = useState(false);
  const isNewEstablishment = isNil(establishment?.id);
  const [form, setForm] = useState<EstablishmentModel>(establishment || emptyEstablishmentModel);
  const [isFormCompleted, setIsFormCompleted] = useState(false);

  const handleFormUpdate = (fieldsToUpdate: Partial<EstablishmentModel>) => {
    setForm((prevState) => {
      const updatedForm = { ...prevState, ...fieldsToUpdate };
      const fieldsToValidate = [
        updatedForm.name,
        updatedForm.longitude,
        updatedForm.latitude,
        updatedForm.tosCheckbox,
        updatedForm.fullAddress,
      ];
      setIsFormCompleted(
        (fieldsToValidate.every((field) => field || !isEmpty(field)) &&
          updatedForm.tosCheckbox &&
          updatedForm.servicesId?.size > 0) ||
          false,
      );
      return updatedForm;
    });
  };
  const { ref: autocompleteInputRef }: { ref: RefObject<HTMLInputElement> } = usePlacesWidget({
    apiKey: googleMapsApiKey,
    onPlaceSelected: (place) => {
      const {
        address_components,
        geometry: { location },
      } = place;
      const country = address_components.find((component: { types: string[] }) => component.types.includes('country'))?.long_name;
      const province =
        address_components.find((component: { types: string[] }) => component.types.includes('administrative_area_level_1'))
          ?.long_name || '';
      const city =
        address_components.find((component: { types: string[] }) => component.types.includes('administrative_area_level_2'))
          ?.long_name || '';
      const department =
        address_components.find((component: { types: string[] }) => component.types.includes('locality'))?.long_name || city;
      const streetName =
        address_components.find((component: { types: string[] }) => component.types.includes('route'))?.long_name || '';
      const streetNumber = address_components.find((component: { types: string[] }) =>
        component.types.includes('street_number'),
      )?.long_name;
      handleFormUpdate({
        fullAddress: place.formatted_address,
        street: streetName,
        streetNumber,
        address: place.formatted_address,
        latitude: location.lat(),
        longitude: location.lng(),
        country,
        province,
        city,
        department,
      });
    },
    options: GOOGLE_MAPS_AUTOCOMPLETE_OPTIONS,
  });

  const handleFieldChange = (event: { currentTarget: { value: string; name: string } }) => {
    const { name: elementName, value } = event.currentTarget;
    handleFormUpdate({ [elementName]: value });
  };
  const handleCheckboxChange = (event: { currentTarget: { name: string; checked: boolean } }) => {
    const { name: elementName, checked } = event.currentTarget;
    handleFormUpdate({ [elementName]: checked });
  };
  const buildEstablishmentPayload = (establishment: Partial<EstablishmentModel>) => {
    const establishmentPayload = _(establishment)
      .omitBy(isNull)
      .pick([
        'name',
        'type',
        'street',
        'streetNumber',
        'apartment',
        'intersection',
        'details',
        'website',
        'city',
        'department',
        'province',
        'country',
        'latitude',
        'longitude',
      ])
      .value();

    return {
      ...establishmentPayload,
      services: Array.from(
        services.map((ser) => {
          return {
            id: ser.id,
            serviceId: ser.serviceId,
            subserviceId: ser.subserviceId,
            phoneNumber: ser.phoneNumber,
            details: ser.details,
            email: ser.email,
            openingTimes: ser.openingTimes,
          };
        }),
      ),
    };
  };
  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const payload = buildEstablishmentPayload(form);
      if (isNewEstablishment) {
        const { data } = await axios.post('/api/establishments/', payload);
        setIsUpdateSuccessful(true);
        setShowModal(true);
      } else {
        await axios.put(`/api/establishments/${establishment?.id}`, payload);
        setIsUpdateSuccessful(true);
        setShowModal(true);
      }
    } catch (e: any) {
      setIsError(true);
      setShowModal(true);
    }
  };
  const handleContinueButtonClicked = () => {
    setIsSearchStepCompleted(true);
  };

  const handleChildMouseMove = async (hoverKey: any, childProps: any, mouse: any) => {
    handleFormUpdate({ latitude: mouse.lat, longitude: mouse.lng });
  };
  const {
    name,
    street,
    address,
    type,
    fullAddress,
    streetNumber,
    apartment,
    intersection,
    services,
    servicesId,
    website,
    phone,
    whatsApp,
    email,
    tosCheckbox,
    latitude,
    longitude,
    details,
    availability,
  } = form;

  return (
    <div className="w-full flex justify-center">
      <MainContainer className={'full h-fit lg:h-full lg:w-3/5 lg:mx-4 mt-4 pt-8 lg:py-8 lg:px-8 lg:flex-grow-0'}>
        <div className={'text-center lg:py-4'}>
          {isNewEstablishment ? (
            <h2 className={'px-content text-2xl font-bold text-black'}>Nuevo establecimiento</h2>
          ) : (
            <h2 className={'px-content text-2xl font-bold text-black'}>Editar establecimiento</h2>
          )}
          <p className="font-normal text-base text-black">Por favor, completá los datos del lugar</p>
        </div>
        <div className="mx-o lg:mx-12">
          {isNewEstablishment && !isSearchStepCompleted && (
            <EstablishmentSearchStep
              key={'name'}
              onChange={handleFieldChange}
              name={name}
              ref={autocompleteInputRef}
              address={address}
              latitude={latitude}
              longitude={longitude}
              onClick={handleContinueButtonClicked}
            />
          )}
          {(isSearchStepCompleted || !isNewEstablishment) && (
            <>
              <input
                key={'name'}
                name={'name'}
                className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
                placeholder={'Nombre del establecimiento'}
                onChange={handleFieldChange}
                value={name}
              />
              <Select
                name={'type'}
                placeholder={'Tipo de establecimiento'}
                onSelect={handleFieldChange}
                value={type}
                items={establishmentTypes}
              />
              <LocationField
                key={'surroundingStreets'}
                onChange={handleFieldChange}
                fullAddress={fullAddress}
                street={street}
                streetNumber={streetNumber}
                apartment={apartment}
                intersection={intersection}
                apiKey={googleMapsApiKey}
                onChildMouseMove={handleChildMouseMove}
                latitude={latitude}
                longitude={longitude}
              />

              {/*<AvailabilityField key={'workingHourTo'} onChange={handleFormUpdate} availability={availability} />*/}
              <ContactInfoField key={'email'} onChange={handleFieldChange} website={website} />

              <AvailableServices
                onChange={handleFormUpdate}
                activeServicesId={servicesId}
                activeServices={services}
                availableServices={availableServices}
              />

              <h2 className={'mt-6 mb-2 font-bold text-black'}>¿Algo más que quieras agregar sobre el lugar?</h2>
              <p className={'text-xs mb-2'}>
                Por ejemplo referencias de acceso, o cualquier otro dato relevante sobre el establecimiento
              </p>
              <textarea
                name={'details'}
                value={details || undefined}
                onChange={handleFieldChange}
                className={'w-full p-4 mt-2 rounded-lg'}
                rows={4}
                placeholder={'Escribí tus comentarios aca'}
              ></textarea>
              <label className={'cursor-pointer flex mt-10 mb-8'} htmlFor="terms-checkbox">
                <input
                  id="terms-checkbox"
                  key={'tosCheckbox'}
                  name={'tosCheckbox'}
                  className={'mr-2 cursor-pointer'}
                  type={'checkbox'}
                  onChange={handleCheckboxChange}
                  checked={tosCheckbox}
                />
                <p className={'text-xs'}>
                  Acepto los{' '}
                  <a
                    className={'text-xs hover:text-primary'}
                    onClick={async () => {
                      await router.push({ pathname: '/terminos-condiciones' });
                    }}
                  >
                    términos y condiciones y la publicación de los datos en el sitio
                  </a>
                </p>
              </label>
              {isError && (
                <Alert title={'Error durante la creacion de establecimiento'} message={'Hubo un problema en el servidor'} />
              )}
              {isUpdateSuccessful && (
                <Modal showModal={showModal}>
                  <div className="flex justify-end pb-4">
                    <button onClick={() => setShowModal(false)}>
                      <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
                    </button>
                  </div>
                  <div className="p-4">
                    {isNewEstablishment ? (
                      <Alert
                        title={'¡Creado con éxito!'}
                        message={'El establecimiento fue creado correctamente'}
                        success={true}
                      />
                    ) : (
                      <Alert
                        title={'¡Edición exitosa!'}
                        message={'El establecimiento fue editado correctamente'}
                        success={true}
                      />
                    )}
                  </div>

                  <button
                    className="btn-secondary mb-5 mt-2"
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      router.push('/');
                    }}
                  >
                    Volver al inicio.
                  </button>
                </Modal>
              )}
              {isNewEstablishment ? (
                <Button className={'w-full my-5'} disabled={!isFormCompleted} type={'primary'} onClick={handleFormSubmit}>
                  Agregar establecimiento
                </Button>
              ) : (
                <Button className={'w-full my-5'} disabled={!isFormCompleted} type={'primary'} onClick={handleFormSubmit}>
                  Editar establecimiento
                </Button>
              )}
            </>
          )}
        </div>
      </MainContainer>
    </div>
  );
};

export default EstablishmentAdmin;
