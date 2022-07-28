import { useRouter } from 'next/router';
import { ChevronLeftIcon } from '@heroicons/react/solid';

export const BackButton = () => {
  const router = useRouter();
  const navigateBack = () => router.back();
  return (
    <button className={'h-6 mr-2'} onClick={navigateBack} aria-label={'Go back'}>
      <ChevronLeftIcon className="w-8 -m-2 text-dark-gray" />
    </button>
  );
};
