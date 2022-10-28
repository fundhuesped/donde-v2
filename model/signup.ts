import * as yup from 'yup';
import { urlRegex } from './establishment';

export type SignupRequest = yup.InferType<typeof signupRequestSchema>;
export const signupRequestSchema = yup.object({
  userId: yup.string().required(),
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  status: yup.string().required(),
  organizationName: yup.string().required(),
  organizationCountry: yup.string().required(),
  organizationRole: yup.string().required(),
  organizationType: yup.string().required(),
  organizationWebsite: yup.string().matches(urlRegex, 'Website is not valid').nullable(),
  createdAt: yup.date().required(),
});

export type SignupRequests = yup.InferType<typeof signupRequestsSchema>;
export const signupRequestsSchema = yup.array(signupRequestSchema).required();
