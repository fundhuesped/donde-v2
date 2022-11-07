import { XIcon } from '@heroicons/react/outline';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { establishmentTypes } from '../../model/establishment';
import { emptyEstablishmentModel, EstablishmentModel } from '../Establishment/EstablishmentAdmin';
import { Modal } from '../Modal';
import Select from '../Select';

type Props = React.PropsWithChildren<{
  showModal?: boolean;
  setShowModal: (x:any) => void;
  establishment?: EstablishmentModel;
}>;
const EditModal = (props:Props) => {
    const {showModal, setShowModal, establishment} = props;
    const router = useRouter();
    const [isFormCompleted, setIsFormCompleted] = useState(false);
    const [form, setForm] = useState<EstablishmentModel>(establishment || emptyEstablishmentModel);

    console.log(establishment);
    
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

    const handleFieldChange = (event: { currentTarget: { value: string; name: string } }) => {
        const { name: elementName, value } = event.currentTarget;
        handleFormUpdate({ [elementName]: value });
    };
     const handleCheckboxChange = (event: { currentTarget: { name: string; checked: boolean } }) => {
        const { name: elementName, checked } = event.currentTarget;
        handleFormUpdate({ [elementName]: checked });
    };

  return (
     <Modal bg={'bg-white'} width={'w-[32rem]'} rounded={'rounded-md'} showModal={showModal} className={'bg-neutral-600/50 '} height={' mt-0 lg:mt-4 h-screen overflow-x-hidden overflow-y-auto scroll-style'}>
          <div className="w-full flex justify-end ">
            <button onClick={() => setShowModal(false)}>
              <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
            </button>
          </div>
          <div className="flex items-left justify-center flex-col px-12 py-1 rounded-b ">
            <div className="w-full">
                    <input
                        key={'name'}
                        name={'name'}
                        className={'rounded-lg p-3 w-full border border-light-gray focus:outline-0 mt-6'}
                        placeholder={'Nombre del establecimiento'}
                        // onChange={handleFieldChange}
                        // value={name}
                    />
                    <Select
                        name={'type'}
                        placeholder={'Tipo de establecimiento'}
                        onSelect={handleFieldChange}
                        // value={type}
                        items={establishmentTypes}
                    />
                    {/* <LocationField
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
                    /> */}
                    {/* <ContactInfoField key={'email'} onChange={handleFieldChange} website={website} /> */}

                    {/* <AvailableServices
                        onChange={handleFormUpdate}
                        // activeServicesId={servicesId}
                        // activeServices={services}
                        // availableServices={availableServices}
                    /> */}

                    <h2 className={'mt-6 mb-2 font-bold text-black'}>¿Algo más que quieras agregar sobre el lugar?</h2>
                    <p className={'text-xs mb-2'}>
                        Por ejemplo referencias de acceso, o cualquier otro dato relevante sobre el establecimiento
                    </p>
                    <textarea
                        name={'details'}
                        // value={details || undefined}
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
                    // checked={tosCheckbox}
                    />
                    <p className={'text-xs'}>
                    Acepto los{' '}
                    <button
                        className={'text-xs hover:text-primary'}
                        onClick={async () => {
                        await router.push({ pathname: '/terminos-condiciones' });
                        }}
                    >
                    términos y condiciones y la publicación de los datos en el sitio
                    </button>
                    </p>
                    </label>
                    {/* {isError && (
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
                                <Alert
                                    title={'¡Edición exitosa!'}
                                    message={'El establecimiento fue editado correctamente'}
                                    success={true}
                                />
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
                        )} */}
                
                </div>
            </div>
            <div className="w-full flex justify-center py-3">
              <button
                className="btn-secondary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
                type="button"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancelar
              </button>
              <button
              className="btn-primary w-1/3 p-1 flex justify-center aling-center text-sm mr-2 rounded-xl"
                
                type="button"
                onClick={() => {
                  setShowModal(false);
                }}
              >
               Guardar
              </button>
              {/* <Button className={'w-full my-5'} disabled={!isFormCompleted} type={'primary'} onClick={handleFormSubmit}>
                  Editar establecimiento
                </Button> */}
          </div>
        </Modal>
  )
}

export default EditModal