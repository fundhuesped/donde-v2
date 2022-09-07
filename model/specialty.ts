import { Service } from '@prisma/client';

export type SpecialtyWithService = {
  id: string;
  name: string | null;
  service: Service;
};
