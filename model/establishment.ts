import * as PrismaClient from '@prisma/client';
import * as yup from 'yup';

// prettier-ignore
export const establishmentSchema = yup.object({
  id: yup.string().uuid().when('$create', (create, fieldSchema) => create ? fieldSchema : fieldSchema.required()),
  officialId: yup.string(),
  name: yup.string().when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  type: yup.mixed().oneOf(Object.values(PrismaClient.EstablishmentType)).when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  street: yup.string().when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  streetNumber: yup.string(),
  apartment: yup.string(),
  intersection: yup.string(),
  details: yup.string(),
  website: yup.string().url(),
  city: yup.string().when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  department: yup.string().when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  province: yup.string().when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  country: yup.string().when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  latitude: yup.number().min(-90).max(90).when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  longitude: yup.number().min(-180).max(180).when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
  specialties: yup.array().of(yup.string().uuid()).min(1).when('$create', (create, fieldSchema) => create ? fieldSchema.required() : fieldSchema),
});
