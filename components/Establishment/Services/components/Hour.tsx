import { XIcon } from '@heroicons/react/outline';
import { ServiceOnEstablishmentOpeningTime } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Day } from '../EditService';

type HoursProps = {
    dayHour: { id: string; day: string;  startTime: string;
    endTime: string; },
    setOpeningTimes: (x: any ) => void;
    getDays: { id: string; day: Day;  startTime: string;
    endTime: string; }[];
    position: number;
    openingTimes: ServiceOnEstablishmentOpeningTime[];
};

export const Hour = ({dayHour, setOpeningTimes, openingTimes, getDays, position}:HoursProps)=>{

    const [start, setStart] = useState(dayHour.startTime?dayHour.startTime:"")
    const [end, setEnd] = useState(dayHour.endTime?dayHour.endTime:"") 
    
    const deleteHandler = () => {
        setOpeningTimes(getDays.filter(day => day.id !== dayHour.id))
    }

   useEffect(() => {
        if (start || end) {
            let copyOpeningTimes = [...openingTimes]

            const findOpeningTimeIndex = copyOpeningTimes.findIndex((findTime)=> findTime.id === dayHour.id);
            
            copyOpeningTimes[findOpeningTimeIndex] = {...copyOpeningTimes[findOpeningTimeIndex], endTime: new Date("1970-01-01T" + end + ":00.000Z") , startTime: new Date("1970-01-01T" + start + ":00.000Z")}

            setOpeningTimes(copyOpeningTimes)
        }
    }, [end, start])
   

    
    return (
        <div  className='flex flex-row justify-evenly px-4 mb-2'>
            <div>
                 {(() => { switch (dayHour.day) {
                    case "M": return <p className='mt-2 font-light'>L</p>
                       break;
                    case "T": return <p className='mt-2 font-light'>M</p>
                        break;
                    case "W": return <p className='mt-2 font-light'>X</p>
                        break;
                    case "R": return <p className='mt-2 font-light'>J</p>
                        break;
                    case "F": return <p className='mt-2 font-light'>V</p>
                        break;
                    case "S": return <p className='mt-2 font-light'>S</p>
                        break;
                    case "U": return <p className='mt-2 font-light'>D</p>
                        break;          
                    }})()}
            </div>
            <div>
                <input type="text" maxLength={5} placeholder='Apertura' className={'rounded-lg mr-2 p-2 border border-gray-300 w-28 focus:border-primary font-light'} value={start} onChange={(e)=>setStart(e.target.value)}/>
            </div> 
            <div>
                <input type="text" maxLength={5} placeholder='Cierre' className={'rounded-lg mr-2 p-2 border border-gray-300 w-28 focus:border-primary font-light'} value={end} onChange={(e)=>setEnd(e.target.value)}/>
            </div>
            <button onClick={deleteHandler}>
                <XIcon className="mr-4 text-primary w-4.5"></XIcon>
            </button>
        </div>
    )
}