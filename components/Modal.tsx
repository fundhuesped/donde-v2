import classNames from 'classnames';
import React from 'react';

export type ModalProps = React.PropsWithChildren<
  {
    showModal?: boolean;
    className?: string;
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const { showModal, children, className } = props;

  return (
    <>
      {showModal ? (
        <div className={classNames(className, 'modal-style')}>
          <div className="relative my-6 mx-auto w-[30rem] h-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ultra-light-gray outline-none focus:outline-none">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
