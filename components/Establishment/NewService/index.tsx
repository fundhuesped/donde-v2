import { PlusIcon, TrashIcon, XIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Button } from '../../Button';
import { Modal } from '../../Modal';
import { Hour } from './Hour';
 const days = [
        {
            day:'L',
            key: 'M',
            select: false
        }, {
            day:'M',
            key: 'T',
            select: false
        }, {
            day:'M',
            key: 'W',
            select: false
        }, {
            day:'J',
            key: 'R',
            select: false
         }, {
            day:'V',
            key: 'F',
            select: false
         }, {
            day:'S',
            key: 'S',
            select: false
         }, {
            day:'D',
            key: 'U',
            select: false
        }
    ]

export const NewService = ({showModal, setShowModal}) => {   
   const [checked, setChecked] = useState([])
   const [checkedDay, setCheckedDay] = useState([])
   const [checkedOpen, setCheckedOpen] = useState(false)
   const [hours, setHours] = useState([])
   const [error, setError] = useState("")

    const handleCheck = (event, days) => {
        var updatedList = [...checked];        

        if (event.target.checked) {
            updatedList = [...checked, event.target.value];
            setCheckedDay([...checkedDay, {day: days.day, key: days.key}])
            
        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
            setCheckedDay(checkedDay.filter(day => day.key !== days.key))

        }
        setChecked(updatedList);
        
    };
   
    const isChecked = (item) => checked.includes(item) ? "text-primary" : "";

    const handleOnChange = ()=>{
        setCheckedOpen(!checkedOpen)
    }

    const addHour = (checkedDay)=>{

        const mappedDays = checkedDay.map(day=>{return {...day, id:Math.trunc(Math.random() * 10000)}})

        if(checkedDay.length){
            setHours([...hours, ...mappedDays])
            setError("")
        }else{
            setError("No olvide ingresar un día")
        }
        
    }

    

  return (
        <Modal showModal={showModal} bg={'bg-white'} height={''} className={'bg-neutral-600/50 overflow-auto touch-pan-y'}>
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
                        <button onClick={()=>addHour(checkedDay)} className={'flex text-medium-gray font-bold p-2 btn-inherit'}>
                            <span className="mr-1 mt-1">
                                <TrashIcon className=" w-4 mx-1 text-medium-gray" />
                            </span>
                            Eliminar servicio
                        </button>
                    </div>

                    <select className={' text-gray-400 bg-white rounded-lg border border-gray-300 w-full focus:ring-primary mb-4 p-2 mt-4'}>
                        <option value="" selected>Seleccioná tipo de servicio</option>
                    </select>
                    <input type="text" placeholder='Teléfono de atención del servicio' className={'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2'}/>

                   
                    <ul className='flex flex-row justify-center p-4'>
                    {days.map((day, idx)=>{
                        return<li key={day.key} >
                        <label className='relative cursor-pointer text-center items-center content-center justify-center ' htmlFor={`${day.key}-${idx}`}>
                                <input 
                                    type="checkbox" 
                                    className="form-check-input appearance-none  w-8 h-8 mr-3  border rounded-full bg-ultra-light-gray checked:bg-secondary  focus:outline-none transition duration-200 mt-1 align-middle cursor-pointer z-30" 
                                    name="checkbox" 
                                    value={day.key}
                                    id={`${day.key}-${idx}`} 
                                    onChange={(e)=>handleCheck(e, day)}
                                />
                            <span className={`absolute left-2.5 right-5 top-0 z-40 ${isChecked(day.key)} `}>{day.day}</span> 
                            </label>
                        </li>
                        
                        })}
                    </ul>
                    <p className='text-neutral-800 font-semibold text-center '>{error}</p>
                    <div className='flex flex-row justify-evenly p-4'>
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
                    </div>
                </div>
                {hours.map((dayHour, idx)=>{
                    return  <Hour dayHour={dayHour} key={dayHour.id + idx} setHours={setHours} hours={hours} />
                    })
                }
                <button onClick={()=>addHour(checkedDay)} className={'flex text-medium-gray font-bold p-2 btn-inherit'}>
                    <span className="mr-1 mt-1 mb-3">
                        <PlusIcon className=" w-4 mx-1 text-medium-gray" />
                    </span>
                    Agregar horario
                </button>
                      <textarea placeholder='Descripcion del servicio' className={'rounded-lg border border-gray-300 w-full dark:focus:border-primary focus:ring-primary p-2'} rows={4} />
                <div>
                    <Button className={'w-full my-5'}  type={'primary'} >
                    Guardar
                    </Button>
                    <Button className={'w-full my-5'}   type={'secondary'} >
                        Cancelar
                    </Button>
                </div>
            </div>
        </Modal>
  )
}
