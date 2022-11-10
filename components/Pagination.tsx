import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

type Props = React.PropsWithChildren<{
  setPageNumber: (e: any) => void;
  pagesList: number[];
  pageNumber: number;
  pages: number;
}>;

const Pagination = (props: Props) => {
  const { pages, setPageNumber, pagesList, pageNumber } = props;

  const selectedClassName = 'border-red-300 bg-secondary text-primary';

  return (
    <div className="w-full flex justify-center mt-6">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            className="py-2 px-3 leading-tight rounded-l-lg  text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setPageNumber(pageNumber != 1 ? pageNumber - 1 : pageNumber)}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="w-5 text-primary"></ChevronLeftIcon>
          </button>
        </li>
        {pagesList.map((pagesNumber) => {
          return (
            <li key={`page-${pagesNumber}`}>
              <button
                className={`py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-primary ${
                  pagesNumber == pageNumber && selectedClassName
                }`}
                onClick={() => setPageNumber(pagesNumber)}
              >
                {pagesNumber}
              </button>
            </li>
          );
        })}
        <li>
          <button
            className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => setPageNumber(pageNumber != pagesList.length ? pageNumber + 1 : pageNumber)}
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="w-5 text-primary"></ChevronRightIcon>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
