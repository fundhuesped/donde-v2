import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';
import { Service } from '../../model/services';
import { getServices } from '../../server/api/services';
import { tryGetGoogleMapsApiKey } from '../../utils/establishments';

type ServerSideProps = {
  googleMapsApiKey: string;
  availableServices: Service[];
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableServices = await getServices();
  return {
    props: {
      googleMapsApiKey,
      availableServices,
    },
  };
};
const EstablishmentNew: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableServices }) => {
  const router = useRouter();
  const searchLocationParam = router.query.searchLocation;

  return (
    <EstablishmentAdmin
      searchLocationParam={searchLocationParam}
      googleMapsApiKey={googleMapsApiKey}
      availableServices={availableServices}
    />
  );
};

export default EstablishmentNew;
