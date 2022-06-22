import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/solid';

export const BackButton = () => {
  const navigate = useNavigate();
  const handleBackButtonClicked = () => navigate(-1);
  return (
    <button onClick={handleBackButtonClicked} aria-label={"Back button"}>
      <ChevronLeftIcon className="h-8 w-8 ml-2 text-dark-gray" />
    </button>
  );
};
