import Head from 'next/head';
import { FAQLink } from './preguntas-frecuentes';

const TerminosCondiciones = () => {
  return (
    <>
      <Head>
        <title>Dónde - Términos, condiciones y la publicación de los datos en el sitio</title>
      </Head>

      <main className={'px-6 my-2 lg:mx-auto lg:max-w-desktop'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>Términos, condiciones y la publicación de los datos en el sitio</h1>
        <p className={'text-base text-justify mb-6'}>
          Gracias por utilizar <strong>#Dónde.</strong>
        </p>
        <p className={'text-base text-justify mb-6'}>
          En <strong>#Dónde</strong> podés encontrar en un mapa lugares que ofrecen diferentes servicios de salud sexual y
          reproductiva con información adicional como: tipo de servicio, dirección, teléfono, correo electrónico y sitio web,
          entre otros datos.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Las condiciones reales en los servicios pueden ser diferentes de los resultados que te dé la plataforma.{' '}
          <strong>#Dónde</strong> es una fuente de referencia para las personas que la usan y son ellas las responsables de las
          decisiones que toman con la información que ofrecemos.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Es posible participar como Colaborador para sumar nuevos lugares a la base de datos del sitio. Para ello, tendrás que
          crear un perfil que deberá ser aprobado.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Los datos de contacto que se recopilen los utilizaremos para enviar información del trabajo de Fundación Huésped. Podrás
          darte de baja de nuestra lista de distribución cuando quieras.
        </p>
        <p className={'text-base text-justify mb-6'}>
          Está permitido compartir la información incluida en <strong>#Dónde</strong>. También, difundir la plataforma por
          diferentes medios y usarla con fines no lucrativos personales, educativos, laborales u otros. Agradecemos siempre la
          mención de <strong>#Dónde</strong> y que nos informes sobre tu experiencia de uso.
        </p>
        <p className={'text-base text-justify mb-6'}>
          <strong>#Dónde</strong> no tiene fines comerciales y el uso es totalmente gratuito. Ninguna persona o institución puede
          usar la plataforma o sus funcionalidades con fines de lucro.
        </p>
        <p className={'my-4 p-2 bg-ultra-light-salmon rounded-2xl text-center'}>
          Ante cualquier consulta, podés comunicarte con Fundación Huésped a{' '}
          <FAQLink href="mailto: donde@huesped.org.ar">donde@huesped.org.ar</FAQLink>
        </p>
      </main>
    </>
  );
};

export default TerminosCondiciones;
