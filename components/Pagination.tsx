import { ChevronLeftIcon } from '@heroicons/react/outline';
import { ChevronRightIcon } from '@heroicons/react/solid';

type Props = React.PropsWithChildren<{
  onChange?: (e: any) => void;
}>;

const Pagination = (props: Props) => {
  const { onChange } = props;
  return (
    <div className="w-full flex justify-center mt-6">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button className="py-2 px-3 leading-tight rounded-l-lg  text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="w-5 text-primary"></ChevronLeftIcon>
          </button>
        </li>
        <li>
          <button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            1
          </button>
        </li>
        <li>
          <button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            2
          </button>
        </li>
        <li>
          <button
            aria-current="page"
            className="z-10 py-2 px-3 leading-tight text-primary bg-secondary border border-red-300 hover:bg-secondary hover:text-primary dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          >
            3
          </button>
        </li>
        <li>
          <button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            4
          </button>
        </li>
        <li>
          <button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            5
          </button>
        </li>
        <li>
          <button className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="w-5 text-primary"></ChevronRightIcon>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
