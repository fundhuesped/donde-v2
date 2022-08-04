import React from 'react';

export type ModalProps = React.PropsWithChildren<
  {
    showModal?: boolean;
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const { showModal, children } = props;

  return (
    <>
      {showModal ? (
        <div className="modal-style">
          <div className="relative w-auto my-6 mx-auto w-[30rem] h-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-[#F0F0F2] outline-none focus:outline-none">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
