import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin, {
  emptyEstablishmentModel,
  EstablishmentModel
} from '../../../components/Establishment/EstablishmentAdmin';
import { Establishment } from '../../../model/establishment';
import { Service } from '../../../model/services';
import { getEstablishment } from '../../../server/api/establishments';
import { getServices } from '../../../server/api/services';
import { tryGetGoogleMapsApiKey } from '../../../utils/establishments';
import { transformEstablishmentIntoJSONResponse } from '../../api/establishments';

type ServerSideProps = {
  googleMapsApiKey: string;
  establishment: Establishment;
  availableServices: Service[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const { id } = context.query;
  const establishment = await getEstablishment(id);
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableServices = await getServices();

  return {
    props: {
      googleMapsApiKey,
      establishment: transformEstablishmentIntoJSONResponse(establishment),
      availableServices,
    },
  };
};

const mapIntoEstablishmentModel = (establishment: Establishment): EstablishmentModel => {
  const services =
    establishment.services.map(
      (
        service
      ) => {
        
        return {
          id: service.id,
          serviceId: service.serviceId,
          service: service.service,
          phoneNumber: service.phoneNumber,
          details: service.details,
          openingTimes: service.openingTimes
        }
      },
    ) || [];

  const servicesId = establishment.services.map(
      service => service.serviceId  
  )

  return {
    ...emptyEstablishmentModel,
    ...establishment,
    servicesId: new Set(servicesId),
    services: services,
    fullAddress: establishment.province,
  };
};


const EstablishmentEdit: NextPage<ServerSideProps> = ({ googleMapsApiKey, establishment, availableServices }) => {
  const establishmentModel = mapIntoEstablishmentModel(establishment);
  return (
    <EstablishmentAdmin
      googleMapsApiKey={googleMapsApiKey}
      establishment={establishmentModel}
      availableServices={availableServices}
    />
  );
};

export default EstablishmentEdit;
