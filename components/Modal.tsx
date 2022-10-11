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

export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const { showModal, children, className, bg, height} = props;

  return (
    <>
      {showModal ? (
        <div className={classNames(className, 'modal-style')}>
          <div className={`relative my-6 mx-auto w-[30rem] ${height?height:'bg-ultra-light-gray'}`}>
            <div className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full outline-none focus:outline-none ${bg?bg:'bg-ultra-light-gray'}`}>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
