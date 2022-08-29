import React, { RefObject, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { Bounds } from 'google-map-react';
import { usePlacesWidget } from 'react-google-autocomplete';
import MainContainer from '../../components/MainContainer';
import { Button } from '../../components/Button';
import Select from '../../components/Select';
import Toast from '../../components/Toast';
import { DraggableMap } from '../../components/DraggableMap';
import { EstablishmentSearchStep } from '../../components/Establishment/EstablishmentSearchStep';
import { AvailabilityField } from '../../components/Establishment/AvailabilityField';
import { AvailableServices } from '../../components/Establishment/AvailableServices';
import { LocationField } from '../../components/Establishment/LocationField';
import { ContactInfoField } from '../../components/Establishment/ContactInfoField';

const types = [
  { value: 'publico', label: 'Público' },
  { value: 'arancelado', label: 'Arancelado' },
];
const services = [{ id: 'hiv', label: 'Test de HIV' }];

export type EstablishmentModel = {
  name: string;
  address: string;
  streetName: string;
  type: string;
  fullAddress: string;
  streetNumber: string;
  floor: string;
  surroundingStreets: string;
  availableServices: Set<string>;
  website: string;
  phone: string;
  email: string;
  whatsApp: string;
  tosCheckbox: boolean;
  location?: { lat: number; lng: number };
  additionalDescription: string;
  availability: string;
};
const emptyEstablishmentModel = {
  name: '',
  address: '',
  streetName: '',
  type: 'publico',
  fullAddress: '',
  streetNumber: '',
  floor: '',
  surroundingStreets: '',
  availableServices: new Set<string>(),
  website: '',
  phone: '',
  whatsApp: '',
  email: '',
  tosCheckbox: false,
  additionalDescription: '',
  availability: '',
};

const EstablishmentAdmin = (props: { googleMapsApiKey: string; establishment?: EstablishmentModel }) => {
  const { googleMapsApiKey, establishment } = props;
  const [isError, setIsError] = useState(false);
  const [isNewEstablishment, setIsNewEstablishment] = useState(isEmpty(establishment));
  const [form, setForm] = useState<EstablishmentModel>(establishment || emptyEstablishmentModel);
  const [isFormCompleted, setIsFormCompleted] = useState(false);

  const [bounds, setBounds] = useState<Bounds | null>(null);
  const handleFormUpdate = (fieldsToUpdate: Partial<EstablishmentModel>) => {
    setForm((prevState) => {
      const updatedForm = { ...prevState, ...fieldsToUpdate };
      setIsFormCompleted(values(updatedForm).every((field) => field || !isEmpty(field)) && updatedForm.tosCheckbox);
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
      const streetName = address_components.find((component: { types: string[] }) =>
        component.types.includes('route'),
      )?.long_name;
      const streetNumber = address_components.find((component: { types: string[] }) =>
        component.types.includes('street_number'),
      )?.long_name;
      handleFormUpdate({
        fullAddress: place.formatted_address,
        streetName,
        streetNumber,
        address: place.formatted_address,
        location: {
          lat: location.lat(),
          lng: location.lng(),
        },
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
  const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsError(true);
  };
  const handleContinueButtonClicked = () => {
    setIsNewEstablishment(false);
  };

  const handleChildMouseMove = async (hoverKey: any, childProps: any, mouse: any) => {
    handleFormUpdate({ location: { lat: mouse.lat, lng: mouse.lng } });
  };
  const {
    name,
    streetName,
    address,
    type,
    fullAddress,
    streetNumber,
    floor,
    surroundingStreets,
    availableServices,
    website,
    phone,
    whatsApp,
    email,
    tosCheckbox,
    location,
    additionalDescription,
    availability,
  } = form;
  return (
    <>
      <h1 className={'px-content text-justify font-bold text-black'}>Nuevo establecimiento</h1>
      <MainContainer className={'mt-4 pt-8'}>
        <p>Por favor, completá los datos del lugar</p>
        {isNewEstablishment && (
          <EstablishmentSearchStep
            key={'name'}
            onChange={handleFieldChange}
            name={name}
            ref={autocompleteInputRef}
            address={address}
            location={location}
            onClick={handleContinueButtonClicked}
          />
        )}
        {!isNewEstablishment && (
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
              items={types}
            />
            <LocationField
              key={'surroundingStreets'}
              onChange={handleFieldChange}
              fullAddress={fullAddress}
              streetName={streetName}
              streetNumber={streetNumber}
              floor={floor}
              surroundingStreets={surroundingStreets}
            />

            <DraggableMap
              key={'markerPosition'}
              apiKey={googleMapsApiKey}
              onChildMouseMove={(key, childProps, mouse) => handleChildMouseMove(key, childProps, mouse)}
              location={location}
              onChange={({ bounds }) => {
                setBounds(bounds);
              }}
            />
            {/*<AvailabilityField key={'workingHourTo'} onChange={handleFormUpdate} availability={availability} />*/}
            <AvailableServices onChange={handleFormUpdate} availableServices={availableServices} services={services} />
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
              name={'additionalDescription'}
              value={additionalDescription}
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
              <Toast
                title={'El establecimiento ya existe'}
                message={'Este establecimiento ya existe en nuestra base de datos.'}
              />
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
