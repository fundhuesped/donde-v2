import React, { RefObject, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import pick from 'lodash/pick';
import isEmpty from 'lodash/isEmpty';
import { usePlacesWidget } from 'react-google-autocomplete';
import MainContainer from '../../components/MainContainer';
import { Button } from '../Button';
import Select from '../../components/Select';
import Alert from '../Alert';
import { EstablishmentSearchStep } from './EstablishmentSearchStep';
import { AvailableServices } from './AvailableServices';
import { LocationField } from './LocationField';
import isNil from 'lodash/isNil';
import { establishmentTypes } from '../../model/establishment';
import { Specialty } from '../../model/specialty';

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
  specialties: Set<string>;
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
  specialties: new Set<string>(),
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
  availableSpecialties: Specialty[];
}) => {
  const { googleMapsApiKey, establishment, availableSpecialties } = props;
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [isSearchStepCompleted, setIsSearchStepCompleted] = useState(false);
  const [isNewEstablishment, setIsNewEstablishment] = useState(isNil(establishment?.id));
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
          updatedForm.specialties?.size > 0) ||
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
    options: {
      componentRestrictions: { country: 'ar' },
      types: ['locality', 'street_address', 'sublocality', 'health', 'intersection'],
    },
  });

  const handleFieldChange = (event: { currentTarget: { value: string; name: string } }) => {
    const { name: elementName, value } = event.currentTarget;
    handleFormUpdate({ [elementName]: value });
  };
  const handleCheckboxChange = (event: { currentTarget: { name: string; checked: boolean } }) => {
    const { name: elementName, checked } = event.currentTarget;
    handleFormUpdate({ [elementName]: checked });
  };
  const buildEstablishmentPayload = (establishment: EstablishmentModel) => {
    const establishmentPayload = pick(establishment, [
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
    ]);

    return { ...establishmentPayload, specialties: Array.from(specialties) };
  };
  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const payload = buildEstablishmentPayload(form);
      if (isNewEstablishment) {
        const { data } = await axios.post('/api/establishments/', payload);
        await router.push({ pathname: `/establecimientos/${data.id}` });
      } else {
        await axios.put(`/api/establishments/${establishment?.id}`, payload);
        setIsUpdateSuccessful(true);
        await router.push({ pathname: `/establecimientos/${establishment?.id}` });
      }
    } catch (e: any) {
      console.log(e.message);
      setIsError(true);
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
    specialties,
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
    <>
      <h1 className={'px-content text-justify font-bold text-black'}>Nuevo establecimiento</h1>
      <MainContainer className={'mt-4 pt-8'}>
        <p>Por favor, completá los datos del lugar</p>
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
            <AvailableServices onChange={handleFormUpdate} specialties={specialties} services={availableSpecialties} />
            {/*<ContactInfoField
              key={'email'}
              onChange={handleFieldChange}
              website={website}
              phone={phone}
              whatsApp={whatsApp}
              email={email}
            />*/}

            <h1 className={'mt-6 mb-2 font-bold text-black'}>¿Algo más que quieras agregar sobre el lugar?</h1>
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
            <div className={'flex mt-10 mb-8'}>
              <input
                key={'tosCheckbox'}
                name={'tosCheckbox'}
                className={'mr-2 '}
                type={'checkbox'}
                onChange={handleCheckboxChange}
                checked={tosCheckbox}
              />
              <p className={'text-xs'}>Acepto los términos y condiciones y la publicación de los datos en el sitio</p>
            </div>
            {isError && (
              <Alert title={'Error durante la creacion de establecimiento'} message={'Hubo un problema en el servidor'} />
            )}
            {isUpdateSuccessful && (
              <Alert title={'Edicion exitosa!'} message={'El establecimiento fue editado correctamente'} success={true} />
            )}
            <Button className={'w-full my-5'} disabled={!isFormCompleted} type={'primary'} onClick={handleFormSubmit}>
              Agregar establecimiento
            </Button>
          </>
        )}
      </MainContainer>
    </>
  );
};

export default EstablishmentAdmin;
