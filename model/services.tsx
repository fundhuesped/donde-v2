import * as yup from 'yup';

export enum ServiceIcon {
  ITS = 'ITS',
  MAC = 'MAC',
  ABORTO = 'ABORTO',
  VACUNATORIOS = 'VACUNATORIOS',
  PRESERVATIVOS = 'PRESERVATIVOS',
}

export type Service = yup.InferType<typeof serviceSchema>;
export const serviceSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  icon: yup.mixed<ServiceIcon>().oneOf(Object.values(ServiceIcon)).required(),
});
