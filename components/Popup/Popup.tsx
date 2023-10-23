import React from 'react';
import Image from 'next/image';
import img from '../../assets/images/PopupDonacion.jpg';

export type PopupProps = {
  onClose: () => void;
  showPopup: boolean;
};

const Popup: React.FC<PopupProps> = (props) => {
  const { onClose, showPopup } = props;
  const closePopup = () => {
    if (showPopup) {
      onClose();
    }
  };
  return (
    <div className={`fixed inset-0 flex p-4 items-center justify-center z-50 ${showPopup ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-opacity-40 bg-black z-50" onClick={closePopup}></div>
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg relative p-4 z-50">
          <a href="https://bit.ly/donde-dona" target="_blank" rel="noopener noreferrer">
            <Image src={img} alt="Ayudanos con tu donación" width={800} height={600} />
          </a>
          <button
            className="close-button absolute top-6 right-6 z-50 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={onClose}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
