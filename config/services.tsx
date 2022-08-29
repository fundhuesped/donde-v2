import { ReactNode } from 'react';
import CentroInfectologia from '../assets/images/icons/IconCentros.svg';
import InterrupcionEmbarazo from '../assets/images/icons/IconIVE.svg';
import Anticonceptivos from '../assets/images/icons/IconMAC.svg';
import Condones from '../assets/images/icons/IconPreservativos.svg';
import TestDeVIH from '../assets/images/icons/IconTestVIH.svg';
import Vacunatorios from '../assets/images/icons/IconVacunas.svg';

export const SERVICE_ICONS: Record<string, ReactNode> = {
  preservativos: <Condones />,
  infectologia: <CentroInfectologia />,
  'test-its': <TestDeVIH />,
  anticonceptivos: <Anticonceptivos />,
  vacunatorios: <Vacunatorios />,
  aborto: <InterrupcionEmbarazo />,
};
