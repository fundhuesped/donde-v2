import { Subservice } from '@prisma/client';
import * as yup from 'yup';

export enum ServiceIcon {
  ITS = 'ITS',
  MAC = 'MAC',
  ABORTO = 'ABORTO',
  VACUNATORIOS = 'VACUNATORIOS',
  PRESERVATIVOS = 'PRESERVATIVOS',
}

export type Service = {
  id: string;
  name: string;
  icon: string;
  subservices: Subservice[];
};

export const serviceSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  icon: yup.mixed<ServiceIcon>().oneOf(Object.values(ServiceIcon)).required(),
});
