import { ChevronDownIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';


type Props = React.PropsWithChildren<{
    className?:  string;
    items?: {name: string, id:string}[];
    placeholder?: string;
    setQueryFilter:  (x:any)=>void;
    queryFilter: [];
}>;

const MultipleSelect = (props:Props) => {
    const {setQueryFilter, queryFilter, className, items, placeholder} = props;
    const [show, setShow] = useState(false);
    const [filters, setFilters] = useState<string[]>([])
    const setFilter = new Set<string>();

    const handleChange = (filter:string) =>{
        const update = setFilter.has(filter)
        if (update) {
            setFilter.delete(filter);
        }else{
            setFilter.add(filter);
        }
        let arrayFilters = Array.from( setFilter );
        return arrayFilters;
        
    }
    console.log(filters);

    useEffect(() => {
      setFilter.clear() 
      setQueryFilter([]) 
    }, [])
    
    

    return (
        <>
        <div className={`relative inline-block text-left w-full ${className}`}>
            <div>
                <button type="button" className={'mt-6 input-style w-full rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'} id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={()=>setShow(!show)}>
                    <div className='mx-1 flex justify-between w-full'>
                        {placeholder}
                        <ChevronDownIcon className={'w-3 mt-.5 mr-1.5'}/>
                    </div>
                </button>
            </div>{
                show && 
                (<div className="absolute right-0 z-10 mt-1 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-[250px] overflow-y-auto scroll-style" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                    <div className="py-1" role="none">
                        {items && items.map(item=>(
                            <div className="flex items-center px-4 py-2" key={`${item.name}-key`}>
                                <input 
                                    id={`${item.name}-checkbox`} 
                                    type="checkbox" 
                                    value="" 
                                    className="form-check-input appearance-none w-4 h-4 text-black bg-gray-200 rounded border-gray-300 focus:ring-1 checked:bg-primary checked:border-primary"
                                    onChange={()=>setQueryFilter(handleChange(item.name))}
                                />
                                <label htmlFor={`${item.name}-checkbox`} className="ml-2 text-sm font-normal text-gray-700">
                                    {item.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>)
            }
            
        </div>
        </>
    )
}

export default MultipleSelect