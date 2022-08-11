import React from 'react';

export type ModalProps = React.PropsWithChildren<
  {
    showModal?: boolean;
    background?: string;
  } & React.HTMLProps<HTMLButtonElement>
>;

export const Modal: React.FC<ModalProps> = React.memo((props) => {
  const { showModal, children, background } = props;

  return (
    <>
      {showModal ? (
        <div className="modal-style" style={{ background: `${background}` }}>
          <div className="relative w-auto my-6 mx-auto w-[30rem] h-auto">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-ultra-light-gray outline-none focus:outline-none">
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
});
