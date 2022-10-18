import { Service, ServiceOnEstablishmentOpeningTime } from '@prisma/client';
import { ServicesModal } from '../AvailableServices';
import { ModalService } from './components/ModalService';
import EditService from './EditService';


type ServicesProps = {
  showModal: boolean,
  setShowModal: (x: any ) => void;
  modalServiceId: string;
  availableServices: Service[];
  modalService?: {serviceId: string; service: Service; phoneNumber: string | null; details: string | null; openingTimes: ServiceOnEstablishmentOpeningTime[]; }[]
  onChange: (event: { [key: string]: any }) => void;
activeServicesId: Set<string>;
activeServices: ServicesModal;
};



export const Services = ({showModal, setShowModal, availableServices, onChange, modalServiceId, modalService, activeServicesId, activeServices}:ServicesProps) => {   

    return <ModalService showModal={showModal} bg={'bg-white'} height={''} className={'bg-neutral-600/50 overflow-auto touch-pan-y'}>
        <EditService 
            setShowModal={setShowModal}
            modalService={modalService}
            availableServices={availableServices}
            modalServiceId={modalServiceId}
            onChange={onChange}
            activeServicesId={activeServicesId}
            activeServices={activeServices}
        />
    </ModalService>
}
