import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/solid';

export const BackButton = () => {
  const navigate = useNavigate();
  const navigateBack = () => navigate(-1);
  return (
    <button className={'h-6 mr-2'} onClick={navigateBack} aria-label={'Go back'}>
      <ChevronLeftIcon className="w-8 -m-2 text-dark-gray" />
    </button>
  );
};
