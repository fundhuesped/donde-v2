import Select from '../../Select'

const Filtros = () => {
  return (
    <div className='w-full flex'>
        <h4 className={'text-sm font-medium text-black mt-10 mx-4'}>Filtros:</h4>
        <Select
            className= {'input-style w-full mr-2 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
            name={'type'}
            placeholder={'Tipo de establecimiento'}
            onSelect={()=>""}
            value={""}
            items={{ one: ""}}
        />
        <Select
            className= {'input-style w-full mr-2 rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
            name={'type'}
            placeholder={'Servicio'}
            onSelect={()=>""}
            value={""}
            items={{ one: ""}}
        />
        <Select
            className= {'input-style w-full rounded-base h-12 rigth-0 text-sm text-gray-500 right-1'}
            name={'type'}
            placeholder={'País'}
            onSelect={()=>""}
            value={""}
            items={{ one: ""}}
        />
    </div>
  )
}

export default Filtros