import { XIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { Day, ServiceOnEstablishmentOpeningTimeFormat } from '../EditService';

type HoursProps = {
  dayHour: { 
    id: string;
    day: Day;
    startTime: string | Date;
    endTime: string | Date; };
  setOpeningTimes: (x: any) => void;
  getDays: { id: string; day: Day; startTime: string | Date; endTime: string | Date}[];
  openingTimes: ServiceOnEstablishmentOpeningTimeFormat[];
};

export const Hour = ({ dayHour, setOpeningTimes, openingTimes, getDays }: HoursProps) => {
  const [start, setStart] = useState(dayHour.startTime ? dayHour.startTime : '');
  const [end, setEnd] = useState(dayHour.endTime ? dayHour.endTime : '');

  const deleteHandler = () => {
    setOpeningTimes(getDays.filter((day) => day.id !== dayHour.id));
  };

  useEffect(() => {
    if (start || end) {
      let copyOpeningTimes = [...openingTimes];

      const findOpeningTimeIndex = copyOpeningTimes.findIndex((findTime) => findTime.id === dayHour.id);

      copyOpeningTimes[findOpeningTimeIndex] = { ...copyOpeningTimes[findOpeningTimeIndex], startTime: start, endTime: end };

      setOpeningTimes(copyOpeningTimes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, start]);

  const formatHour = (hour:Date | string)=>{
    if (typeof(hour) == 'string') {        
        return hour;
    }
    hour = JSON.stringify(hour);
    return hour;
  }

  return (
    <div className="flex flex-row justify-evenly px-4 mb-2">
      <div>
        {(() => {
          switch (dayHour.day) {
            case 'M':
              return <p className="mt-2 font-light">L</p>;
              break;
            case 'T':
              return <p className="mt-2 font-light">M</p>;
              break;
            case 'W':
              return <p className="mt-2 font-light">X</p>;
              break;
            case 'R':
              return <p className="mt-2 font-light">J</p>;
              break;
            case 'F':
              return <p className="mt-2 font-light">V</p>;
              break;
            case 'S':
              return <p className="mt-2 font-light">S</p>;
              break;
            case 'U':
              return <p className="mt-2 font-light">D</p>;
              break;
          }
        })()}
      </div>
      <div>
        <input
          type="text"
          maxLength={5}
          placeholder="Apertura"
          className={'rounded-lg mr-2 p-2 border border-gray-300 w-28 focus:border-primary font-light'}
          value={formatHour(start)}
          onChange={(e) => setStart(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          maxLength={5}
          placeholder="Cierre"
          className={'rounded-lg mr-2 p-2 border border-gray-300 w-28 focus:border-primary font-light'}
          value={formatHour(end)}
          onChange={(e) => setEnd(e.target.value)}
        />
      </div>
      <button onClick={deleteHandler}>
        <XIcon className="mr-4 text-primary w-4.5"></XIcon>
      </button>
    </div>
  );
};
