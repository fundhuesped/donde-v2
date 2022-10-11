import { XIcon } from '@heroicons/react/outline';

export const Hour = ({dayHour, setHours, hours})=>{



    const deleteHandler = () => {
        setHours(hours.filter(day => day.id !== dayHour.id))
    }
    
    return <div  className='flex flex-row justify-evenly px-4 mb-2'>
                <div>
                    <p className='mt-2 font-light'>{dayHour.day}</p>
                </div>
                <div>
                    <input type="text" maxLength={5} placeholder='Apertura' className={'rounded-lg mr-2 p-2 border border-gray-300 w-28 focus:border-primary'}/>
                </div> 
                <div>
                    <input type="text" maxLength={5} placeholder='Cierre' className={'rounded-lg mr-2 p-2 border border-gray-300 w-28 focus:border-primary '}/>
                </div>
                <button onClick={deleteHandler}>
                    <XIcon className="mr-4 text-primary w-4.5"></XIcon>
                </button>
            </div>
}