import classNames from 'classnames';
import React from 'react';

export type ModalProps = React.PropsWithChildren<
  {
    showModal?: boolean;
    className?: string;
    bg?: string;
    height?: string;
  } & React.HTMLProps<HTMLButtonElement>
>;

export const ModalService: React.FC<ModalProps> = React.memo((props) => {
  const { showModal, children, className, bg, height} = props;

  return (
    <>
      {showModal ? (
        <div className={classNames(className, 'z-40 fixed top-0 left-0 w-full outline-none  bg-neutral-600/50 bg-opacity-50')}>
          <div className={`relative mx-auto w-full mt-0 lg:mt-8 bottom-0 lg:bottom-3 lg:w-[30rem] my-6'} h-screen overflow-x-hidden overflow-y-auto scroll-style`}>
            <div className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${bg?bg:'bg-ultra-light-gray'}`}>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
