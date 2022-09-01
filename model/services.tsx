import * as yup from 'yup';

export type Service = yup.InferType<typeof serviceSchema>;
export const serviceSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  icon: yup.string().required(),
});
