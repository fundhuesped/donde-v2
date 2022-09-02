import {ReactNode} from 'react';
import InterrupcionEmbarazo from '../assets/images/icons/IconIVE.svg';
import Anticonceptivos from '../assets/images/icons/IconMAC.svg';
import Condones from '../assets/images/icons/IconPreservativos.svg';
import TestDeVIH from '../assets/images/icons/IconTestVIH.svg';
import Vacunatorios from '../assets/images/icons/IconVacunas.svg';
import {ServiceIcon} from "../model/services";

export const SERVICE_ICONS: Record<ServiceIcon, ReactNode> = {
  [ServiceIcon.PRESERVATIVOS]: <Condones />,
  [ServiceIcon.ITS]: <TestDeVIH />,
  [ServiceIcon.MAC]: <Anticonceptivos />,
  [ServiceIcon.VACUNATORIOS]: <Vacunatorios />,
  [ServiceIcon.ABORTO]: <InterrupcionEmbarazo />,
};
