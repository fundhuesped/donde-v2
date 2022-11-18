import classNames from 'classnames';
import React from 'react';

export type ModalProps = React.PropsWithChildren<
  {
    showModal?: boolean;
    className?: string;
    bg?: string;
    rounded?: string;
    width?: string;
    height?: string;
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const { showModal, children, className, bg, rounded, width, height } = props;

  return (
    <>
      {showModal ? (
        <div className={classNames(className, 'modal-style')}>
          <div className={`relative my-6 mx-auto ${width ? width : 'w-[30rem]'}`}>
            <div
              className={`border-0 shadow-lg relative flex flex-col w-full outline-none focus:outline-none 
              ${bg ? bg : 'bg-ultra-light-gray'}
              ${rounded ? rounded : 'rounded-lg'}
              ${height ? height : ''}
              `}
            >
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
