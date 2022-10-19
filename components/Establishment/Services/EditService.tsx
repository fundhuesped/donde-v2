import { PlusIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { Service, ServiceOnEstablishmentOpeningTime } from '@prisma/client';
import { uniqueId } from 'lodash';
import { useEffect, useState } from 'react';
import { Button } from '../../Button';
import { ServicesModal } from '../AvailableServices';
import { Hour, newDateHandle } from './components/Hour';

export type Day = "M" | "T" | "W" | "R" | "F" | "S" | "U";

type EditServiceProps = {
    setShowModal: (x: any ) => void;
    modalService?: ServicesModal;
    availableServices: Service[];
    modalServiceId?: string;
    onChange: (event: { [key: string]: any }) => void;
    activeServicesId: Set<string>;
    activeServices: ServicesModal;
};

const EditService = (props:EditServiceProps) => {
    const { setShowModal, modalService, modalServiceId, availableServices, onChange, activeServicesId, activeServices } = props;

    const [checked, setChecked] = useState<string[]>([])
    const [phoneNumber, setPhoneNumber] = useState<string|null>("")
    const [details, setDetails] = useState<string|null>("")
    const [openingTimes, setOpeningTimes] = useState<ServiceOnEstablishmentOpeningTime[]>([])
    const [error, setError] = useState<string>("")
    const [serviceId, setServiceId] = useState<string | null>(null)
    const [checkedDays, setCheckedDays] = useState<string[]>([])
    

    const setServiceHandler = (id:string)=>{        
        const serviceSelected = availableServices.filter(ser=> ser.id == id)
        setServiceId(serviceSelected[0].id)
    }
    

    const handleCheck = (e:React.FormEvent<HTMLInputElement>) => {
        var updatedList = [...checked];        
        const check = (e.target as HTMLInputElement).checked
        const checkValue = (e.target as HTMLInputElement).value
        if (check ) {
            updatedList = [...checked, checkValue];
            setCheckedDays(
                [...checkedDays,  checkValue])
        } else {
            updatedList.splice(checked.indexOf(checkValue), 1);
            setCheckedDays(checkedDays.filter(sch => sch !== checkValue))
        }
        setChecked(updatedList);
    };
    
    const isChecked = (item:string) => checked.includes(item) ? "text-primary" : "";

    const addHour = ()=>{        

        if(checkedDays.length){
            const mappedDays =  checkedDays.map( day=>{
                return {
                    id: uniqueId(),
                    serviceOnEstablishmentId: uniqueId(), 
                    day: day as Day, 
                    startTime:  newDateHandle("00:00"), 
                    endTime: newDateHandle("00:00"), 
                }
            })
            setOpeningTimes([...openingTimes, ...mappedDays])
            
            setError("")
        }else{
            setError("No olvide ingresar un día de la semana")
        }
        
    }

    var getDays:{id:string,day:Day,  startTime: string, endTime: string}[] = openingTimes.map(sch=> {        
        return { id:sch.id ,day:sch.day,  startTime: sch.startTime, endTime: sch.endTime}
    })

    useEffect(() => {
        if (modalService?.length) {
            setServiceId(modalService[0].serviceId)
            setPhoneNumber(modalService[0].phoneNumber)
            setDetails(modalService[0].details)
            setOpeningTimes(modalService[0].openingTimes)
        }
    }, [])
    
    

    const addService = (serviceId:string|null, phoneNumber:string | null, details: string | null, getDays: { id: string; day: Day; startTime: string; endTime: string; }[]) => {

        if (modalService?.length) {
           setServiceId(modalService[0].serviceId)
           console.log(modalService);
           
            console.log(serviceId);

        }if(serviceId == null){
            setError("No olvide ingresar el nombre del servicio")
            console.log(serviceId);
            return null;
        }
        

        const formatGetDays = getDays.map(day=>{ return {day: day.day, startTime: day.startTime, endTime: day.endTime}})
   
        const updatedServicesId = new Set(activeServicesId);
        const updatedServices = activeServices;


        let aux = {      
            id: modalService?.length ? modalService[0].id : uniqueId(),
            serviceId: serviceId, 
            phoneNumber: phoneNumber, 
            details: details,
            openingTimes: formatGetDays
        }

        if (modalService?.length) {
            aux.id = modalService[0].id
            const indexService = updatedServices.findIndex(ser=>ser.id == modalService[0].id)
            updatedServices[indexService] = aux

            updatedServicesId.delete(modalService[0].serviceId)
            updatedServicesId.add(serviceId)

            
        }else{
            updatedServices.push(aux)
            updatedServicesId.add(serviceId)
        }
        

        onChange({ servicesId: updatedServicesId, services: updatedServices });
        setShowModal(false)
    };
    
    const removeServices = (service: string) => {
        const updatedServicesId = new Set(activeServicesId);
        const updatedServices = activeServices.filter(ser=>ser.serviceId != service)
        updatedServicesId.delete(service)
        onChange({ servicesId: updatedServicesId, services: updatedServices });
        setShowModal(false)
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
                    <div className='flex justify-between'>
                         <h2 className="text-2xl font-semibold py-2 text-black">
                            Servicio
                        </h2>
                        <button 
                            className={'flex text-primary font-bold p-2 btn-inherit'}
                            onClick={()=>removeServices(modalServiceId ? modalServiceId : "")}
                        >
                            <span className="mr-1 mt-1">
                                <TrashIcon className=" w-4 mx-1 text-primary" />
                            </span>
                            Eliminar servicio
                        </button>
                    </div>
                    <select className={' text-gray-600 bg-white rounded-lg border border-gray-300 w-full focus:ring-primary mb-4 p-2 mt-4'} onChange={e=>setServiceHandler(e.target.value)}>
                        {!modalServiceId && <option value="" selected  hidden>Seleccioná tipo de servicio</option>}
                        {availableServices.map(services=>(
                            services.id == modalServiceId  ?  
                            <option value={services.id} key={services.id} selected>{services.name}</option> :  
                            <option value={services.id} key={services.id}>{services.name}</option>
                            ))
                        }
                    </select>
                    <input type="text" placeholder='Teléfono de atención del servicio' className={'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2 font-light'} value={phoneNumber?phoneNumber:""} onChange={(e)=>setPhoneNumber(e.target.value)}/>

                   
                    <ul className='flex flex-row justify-center p-4'>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center ' >
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                    name="checkbox" 
                                    value={"M"}
                                    id={'lunes'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("M")} `}>L</span>
                            </label>
                        </li>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center ' >
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                    name="checkbox" 
                                    value={"T"}
                                    id={'martes'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("T")} `}>M</span>
                            </label>
                        </li>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center '>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                    name="checkbox" 
                                    value={"W"}
                                    id={'miercoles'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                    <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("W")}`}>X</span>

                            </label>
                        </li>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center '>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                    name="checkbox" 
                                    value={"R"}
                                    id={'jueves'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                   <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("R")}  `}>J</span>

                            </label>
                        </li>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center '>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                    name="checkbox" 
                                    value={"F"}
                                    id={'viernes'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("F")}`}>V</span>
                            </label>
                        </li>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center '>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                   name="checkbox" 
                                    value={"S"}
                                    id={'sabado'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                   <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("S")}`}>S</span>

                            </label>
                        </li>
                        <li>
                            <label className='relative cursor-pointer text-center items-center content-center justify-center'>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30 " 
                                    name="checkbox" 
                                    value={"U"}
                                    id={'domingo'} 
                                    onChange={(e)=>handleCheck(e)}
                                />
                                    <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked("U")}`}>D</span>

                            </label>
                        </li>
                    </ul> 
                    <p className='text-neutral-800 font-semibold text-center '>{error}</p>
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
                {getDays.map((dayHour, idx)=>{

                    return  <Hour dayHour={dayHour} position={idx} key={dayHour.id + idx} setOpeningTimes={setOpeningTimes} openingTimes={openingTimes} getDays={getDays}/>
                    })
                }
                <button 
                    onClick={addHour} className={'flex text-primary font-bold p-2 btn-inherit'}>
                    <span className="mr-1 mt-1 mb-3">
                        <PlusIcon className=" w-4 mx-1 text-primary" />
                    </span>
                    Agregar horario
                </button>
                      <textarea placeholder='Descripcion del servicio' className={'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2 font-light'} rows={4} value={details?details:""} onChange={(e)=>setDetails(e.target.value)}/>
                <div>
                    <Button 
                        className={'w-full my-5'} type={'primary'} 
                        onClick={()=>addService(serviceId, phoneNumber, details, getDays)}
                    >
                        Guardar
                    </Button>
                    <Button className={'w-full my-5'} type={'secondary'} onClick={() => setShowModal(false)} >
                        Cancelar
                    </Button>
                </div>
            </div>
    </>
  )
}

export default EditService