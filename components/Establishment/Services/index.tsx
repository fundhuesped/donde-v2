import { Service } from '../../../model/services';
import { ServicesModal } from '../AvailableServices';
import { ModalService } from './components/ModalService';
import EditService from './EditService';

type ServicesProps = {
  showModal: boolean;
  setShowModal: (x: any) => void;
  modalServiceId: string;
  availableServices: Service[];
  modalService?: ServicesModal;
  onChange: (event: { [key: string]: any }) => void;
  activeServicesId: Set<string>;
  activeServices: ServicesModal;
};

export const Services = ({
  showModal,
  setShowModal,
  availableServices,
  onChange,
  modalServiceId,
  modalService,
  activeServicesId,
  activeServices,
}: ServicesProps) => {
  return (
    <ModalService showModal={showModal} bg={'bg-white'} height={''} className={'bg-neutral-600/50 overflow-auto touch-pan-y'}>
      <EditService
        setShowModal={setShowModal}
        modalService={modalService}
        modalServiceId={modalServiceId}
        onChange={onChange}
        availableServices={availableServices}
        activeServicesId={activeServicesId}
        activeServices={activeServices}
      />
    </ModalService>
  );
};
