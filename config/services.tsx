import { ReactNode } from 'react';
import Condones from '../assets/images/Icons/CondonIcon.svg';
import CentroInfectologia from '../assets/images/Icons/IconCentroInfectologia.svg';
import InterrupcionEmbarazo from '../assets/images/Icons/IconInterrupcionEmbarazo.svg';
import Anticonceptivos from '../assets/images/Icons/IconMetodosAnticonceptivos.svg';
import Vacunatorios from '../assets/images/Icons/IconVacunatorios.svg';
import TestDeVIH from '../assets/images/Icons/TestDeVIH.svg';

export const SERVICE_ICONS: Record<string, ReactNode> = {
  preservativos: <Condones />,
  infectologia: <CentroInfectologia />,
  'test-its': <TestDeVIH />,
  anticonceptivos: <Anticonceptivos />,
  vacunatorios: <Vacunatorios />,
  aborto: <InterrupcionEmbarazo />,
};
