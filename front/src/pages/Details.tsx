import { ChevronLeftIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import MainContainer from '../components/MainContainer';

export const Details = () => {
  return (
    <>
      <div>
        <Link to="/">
          <ChevronLeftIcon className="h-8 w-8 ml-2 text-dark-gray" />
        </Link>
      </div>
      <MainContainer>

      </MainContainer>
    </>
  );
};
