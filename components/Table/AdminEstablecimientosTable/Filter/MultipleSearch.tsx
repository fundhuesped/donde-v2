import { Search } from '../../../Search';

type Props = {
  handleChange: (x: any) => void;
};

const MultipleSearch = (props: Props) => {
  const { handleChange } = props;

  var handleKeyPress = (e: KeyboardEvent) => {
    if (e.key == 'Enter') {
      // @ts-ignore
      handleChange(e.target?.value.toLowerCase());
    }
  };

  return (
    <div className="flex flex-col lg:flex-row mt-6 lg:mt-0 lg:justify-end">
      <h4 className={'text-sm font-medium text-black mt-10 mx-4'}>Buscar por:</h4>

      <Search
        placeholder="Nombre"
        name="search"
        onKeyPress={(e) => handleKeyPress(e)}
        className={'relative input-style w-full mt-8 ml-0 lg:ml-2 rounded-base h-12 right-0 text-sm text-gray-500'}
        iconClassName={'absolute translate-y-24 mt-3 right-8 lg:mt-0 lg:translate-y-12 lg:left-1/3 z-50 w-5 text-light-gray'}
      />
      <Search
        placeholder="Dirección"
        name="search"
        onKeyPress={(e) => handleKeyPress(e)}
        className={'relative input-style w-full mt-8  ml-0 lg:ml-2 rounded-base h-12 right-0 text-sm text-gray-500'}
        iconClassName={'absolute translate-y-44 mt-3 right-8 lg:mt-0  lg:translate-y-12 lg:left-2/4 w-5 text-light-gray'}
      />
      <Search
        placeholder="Nombre de ciudad "
        name="search"
        onKeyPress={(e) => handleKeyPress(e)}
        className={'input-style w-full mt-8  ml-0 lg:ml-2 rounded-base h-12 right-0 text-sm text-gray-500'}
        iconClassName={'absolute translate-y-64 mt-3 right-8 lg:mt-0 lg:translate-y-12 lg:left-2/3 w-5 text-light-gray'}
      />
      <Search
        placeholder="Nombre de provincia"
        name="search"
        onKeyPress={(e) => handleKeyPress(e)}
        className={'input-style w-full mt-8 ml-0 lg:ml-2 rounded-base h-12 right-0 text-sm text-gray-500 '}
        iconClassName={'absolute translate-y-80 mt-6 right-8 lg:mt-0 lg:translate-y-12 lg:left-3/4 lg:ml-28 w-5 text-light-gray'}
      />
    </div>
  );
};

export default MultipleSearch;
