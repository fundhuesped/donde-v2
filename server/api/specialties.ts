import {prismaClient} from "../prisma/client";
export type Specialty = {
  specialty: {
    id: string,
    service: { name: string }
  };
}

export const tryGetAvailableSpecialities = async () => {
  try {
    return (await prismaClient.specialty.findMany());
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};
