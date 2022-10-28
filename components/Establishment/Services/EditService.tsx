import { PlusIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { Service } from '@prisma/client';
import { uniqueId } from 'lodash';
import { useEffect, useState } from 'react';
import { Button } from '../../Button';
import { ServicesModal } from '../AvailableServices';
import { Hour } from './components/Hour';
import { Day, ServiceOnEstablishmentOpeningTimeFormat, SubService } from './types';

type EditServiceProps = {
  setShowModal: (x: any) => void;
  modalService?: ServicesModal;
  availableServices: Service[];
  modalServiceId?: string;
  onChange: (event: { [key: string]: any }) => void;
  activeServicesId: Set<string>;
  activeServices: ServicesModal;
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const EditService = (props: EditServiceProps) => {
  const { setShowModal, modalService, modalServiceId, availableServices, onChange, activeServicesId, activeServices } = props;

  const [checked, setChecked] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>('');
  const [openingTimes, setOpeningTimes] = useState<ServiceOnEstablishmentOpeningTimeFormat[]>([]);
  const [error, setError] = useState<string>('');
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [checkedDays, setCheckedDays] = useState<string[]>([]);
  const [subserviceDisabled, setSubserviceDisabled] = useState<boolean>(true);
  const [subserviceId, setSubserviceId] = useState<string | null>(null);
  const [subserviceOnService, setSubserviceOnService] = useState<Service[] | null>(null);

  const setServiceHandler = (id: string) => {
    const serviceSelected = availableServices.filter((ser) => ser.id == id);

    if (modalService && serviceSelected[0].id != modalService[0].serviceId) {
      var serviceAlreadyActivated = activeServices.find((service) => service.serviceId == serviceSelected[0].id);
      if (serviceAlreadyActivated) {
        setError('El servicio seleccionado ya está activo, seleccione uno que no este activo');
      } else {
        setServiceId(serviceSelected[0].id);
        setError('');
      }
    } else {
      setServiceId(serviceSelected[0].id);
    }
  };
  const setSubserviceIdHandler = (id: string) => {
    setSubserviceId(id);
  };

  const handleCheck = (e: React.FormEvent<HTMLInputElement>) => {
    var updatedList = [...checked];
    const check = (e.target as HTMLInputElement).checked;
    const checkValue = (e.target as HTMLInputElement).value;
    if (check) {
      updatedList = [...checked, checkValue];
      setCheckedDays([...checkedDays, checkValue]);
    } else {
      updatedList.splice(checked.indexOf(checkValue), 1);
      setCheckedDays(checkedDays.filter((sch) => sch !== checkValue));
    }
    setChecked(updatedList);
  };

  const isChecked = (item: string) => (checked.includes(item) ? 'text-primary' : '');

  const addHour = () => {
    if (checkedDays.length) {
      const mappedDays = checkedDays.map((day) => {
        return {
          id: uniqueId(),
          serviceOnEstablishmentId: uniqueId(),
          day: day as Day,
          startTime: '00:00',
          endTime: '00:00',
        };
      });
      setOpeningTimes([...openingTimes, ...mappedDays]);

      setError('');
    } else {
      setError('No olvide ingresar un día de la semana');
    }
  };

  var getDays: { id: string; day: Day; startTime: string | Date; endTime: string | Date }[] = openingTimes.map((sch) => {
    return { id: sch.id, day: sch.day, startTime: sch.startTime, endTime: sch.endTime };
  });

  useEffect(() => {
    if (modalService?.length) {
      setServiceId(modalService[0].serviceId);
      setPhoneNumber(modalService[0].phoneNumber);
      setDetails(modalService[0].details);
      setOpeningTimes(modalService[0].openingTimes);
      setSubserviceId(modalService[0].subserviceId);
      setEmail(modalService[0].email);
    }
  }, []);

  useEffect(() => {
    var filteredService = availableServices.filter((service) => service.subservices.length);
    setSubserviceOnService(filteredService);
    if (filteredService[0].id == serviceId) {
      setSubserviceDisabled(false);
    } else {
      setSubserviceDisabled(true);
      setSubserviceId(null);
    }
  }, [subserviceId, serviceId]);

  const addService = (
    serviceId: string | null,
    phoneNumber: string | null,
    details: string | null,
    subserviceId: string | null,
    email: string | null,
    getDays: { id: string; day: Day; startTime: string | Date; endTime: string | Date }[],
  ) => {
    if (modalService?.length) {
      setServiceId(modalService[0].serviceId);
    }
    if (serviceId == null) {
      setError('No olvide ingresar el nombre del servicio');
      return null;
    }

    const formatGetDays = getDays.map((day) => {
      return { day: day.day, startTime: day.startTime, endTime: day.endTime };
    });

    const updatedServicesId = new Set(activeServicesId);
    const updatedServices: { id: string }[] = activeServices;

    let aux = {
      id: modalService?.length ? modalService[0].id : uniqueId(),
      serviceId: serviceId,
      subserviceId: subserviceId,
      email: email,
      phoneNumber: phoneNumber ? phoneNumber : null,
      details: details,
      openingTimes: formatGetDays,
    };

    if (modalService?.length) {
      aux.id = modalService[0].id;
      const indexService = updatedServices.findIndex((ser) => ser.id == modalService[0].id);
      updatedServices[indexService] = aux;

      updatedServicesId.delete(modalService[0].serviceId);
      updatedServicesId.add(serviceId);
    } else {
      updatedServices.push(aux);
      updatedServicesId.add(serviceId);
    }
    onChange({ servicesId: updatedServicesId, services: updatedServices });
    setShowModal(false);
  };

  const removeServices = (service: string) => {
    const updatedServicesId = new Set(activeServicesId);
    const updatedServices = activeServices.filter((ser) => ser.serviceId != service);
    updatedServicesId.delete(service);
    onChange({ servicesId: updatedServicesId, services: updatedServices });
    setShowModal(false);
  };

  return (
    <>
      <div className="w-full flex justify-end ">
        <button onClick={() => setShowModal(false)}>
          <XIcon className="mr-4 mt-4 text-primary w-4.5"></XIcon>
        </button>
      </div>
      <div className="flex items-left justify-center flex-col px-8 pb-6 rounded-b">
        <div className="w-full ">
          <div className="flex justify-between">
            <h2 className="text-2xl font-semibold py-2 text-black">Servicio</h2>
            <button
              className={'flex text-primary font-bold p-2 btn-inherit'}
              onClick={() => removeServices(modalServiceId ? modalServiceId : '')}
            >
              <span className="mr-1 mt-1">
                <TrashIcon className=" w-4 mx-1 text-primary" />
              </span>
              Eliminar servicio
            </button>
          </div>
          <select
            className={' text-gray-600 bg-white rounded-lg border border-gray-300 w-full focus:ring-primary mb-4 p-2 mt-4'}
            onChange={(e) => setServiceHandler(e.target.value)}
          >
            {!modalServiceId && (
              <option value="" selected hidden>
                Seleccioná tipo de servicio
              </option>
            )}
            {availableServices.map((services) =>
              services.id == modalServiceId ? (
                <option value={services.id} key={services.id} selected>
                  {services.name}
                </option>
              ) : (
                <option value={services.id} key={services.id}>
                  {services.name}
                </option>
              ),
            )}
          </select>
          <select
            className={` text-gray-600 bg-white rounded-lg border border-gray-300 w-full focus:ring-primary mb-4 p-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none`}
            disabled={subserviceDisabled}
            onChange={(e) => setSubserviceIdHandler(e.target.value)}
          >
            {(!modalServiceId || !subserviceId) && (
              <option value="" selected hidden>
                Seleccioná sub servicio
              </option>
            )}
            {subserviceOnService && serviceId == subserviceOnService[0].id ? (
              subserviceOnService[0].subservices.map((subservice: SubService) => {
                if (subserviceId == subservice.id) {
                  return (
                    <option value={subservice.id} key={subservice.id} selected>
                      {subservice.name}
                    </option>
                  );
                } else {
                  return (
                    <option value={subservice.id} key={subservice.id}>
                      {subservice.name}
                    </option>
                  );
                }
              })
            ) : (
              <option value="" selected hidden>
                Seleccioná sub servicio
              </option>
            )}
          </select>
          <input
            type="text"
            placeholder="Teléfono de atención del servicio"
            className={
              'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2 mb-4 font-light'
            }
            value={phoneNumber ? phoneNumber : ''}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico de atención del servicio"
            className={'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2 font-light'}
            value={email ? email : ''}
            onChange={(e) => setEmail(e.target.value)}
          />

          <ul className="flex flex-row justify-center p-4">
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center ">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'M'}
                  id={'lunes'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('M')} `}>L</span>
              </label>
            </li>
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center ">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'T'}
                  id={'martes'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('T')} `}>M</span>
              </label>
            </li>
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center ">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'W'}
                  id={'miercoles'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('W')}`}>X</span>
              </label>
            </li>
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center ">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'R'}
                  id={'jueves'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('R')}  `}>J</span>
              </label>
            </li>
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center ">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'F'}
                  id={'viernes'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('F')}`}>V</span>
              </label>
            </li>
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center ">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'S'}
                  id={'sabado'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('S')}`}>S</span>
              </label>
            </li>
            <li>
              <label className="relative cursor-pointer text-center items-center content-center justify-center">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 "
                  name="checkbox"
                  value={'U'}
                  id={'domingo'}
                  onChange={(e) => handleCheck(e)}
                />
                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked('U')}`}>D</span>
              </label>
            </li>
          </ul>
          {/* <div className='flex flex-row justify-evenly p-4'>
                        <div className='mr-4'>
                            <label htmlFor="" className='text-sm font-normal'>
                                <input 
                                    type={'checkbox'} 
                                    className={'form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-secondary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'}
                                    // checked={!checkedOpen}
                                    // name='state[]'
                                    // value='openState'
                                    // onChange={handleOnChange}
                                />
                            Abierto las 24hs</label>
                        </div>
                        <div>
                            <label htmlFor="" className='text-sm font-normal'>
                                <input 
                                    type={'checkbox'} 
                                    className={'form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-secondary checked:border-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer'} 
                                    // checked={checkedOpen}
                                    // onChange={handleOnChange}
                                    name='state[]'
                                    value='openState'
                                />
                            Cerrado</label>
                        </div>                    
                    </div> */}
        </div>
        {getDays.map((dayHour, idx) => {
          return (
            <Hour
              dayHour={dayHour}
              key={dayHour.id + idx}
              setOpeningTimes={setOpeningTimes}
              openingTimes={openingTimes}
              getDays={getDays}
            />
          );
        })}
        <button onClick={addHour} className={'flex text-primary font-bold p-2 btn-inherit'}>
          <span className="mr-1 mt-1 mb-3">
            <PlusIcon className=" w-4 mx-1 text-primary" />
          </span>
          Agregar horario
        </button>
        <textarea
          placeholder="Descripcion del servicio"
          className={'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2 font-light'}
          rows={4}
          value={details ? details : ''}
          onChange={(e) => setDetails(e.target.value)}
        />
        <p className="text-orange-600 font-light mt-3">{error}</p>

        <div>
          <Button
            className={'w-full my-5'}
            type={'primary'}
            onClick={() => addService(serviceId, phoneNumber, details, subserviceId, email, getDays)}
          >
            Guardar
          </Button>
          <Button className={'w-full my-5'} type={'secondary'} onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    </>
  );
};

export default EditService;
