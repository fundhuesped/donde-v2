import { Subservice } from '@prisma/client';
import * as yup from 'yup';

export enum ServiceIcon {
  ITS = 'ITS',
  MAC = 'MAC',
  ABORTO = 'ABORTO',
  VACUNATORIOS = 'VACUNATORIOS',
  PRESERVATIVOS = 'PRESERVATIVOS',
}

export enum ServiceName {
  ITS = 'Test VIH y otras ITS',
  MAC = 'Métodos anticonceptivos',
  ABORTO = 'Interrupción voluntaria del embarazo',
  VACUNATORIOS = 'Vacunatorios',
  PRESERVATIVOS = 'Preservativos',
}

export type Service = {
  id: string;
  name: string;
  icon: string;
  subservices?: Subservice[];
};

export const serviceSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  icon: yup.mixed<ServiceIcon>().oneOf(Object.values(ServiceIcon)).required(),
});
