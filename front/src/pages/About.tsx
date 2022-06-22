import React from 'react';
import {Button} from "../components/Button";
import {useNavigate} from "react-router-dom";

const About = () => {
    const navigate = useNavigate();
    const handleSearchButtonClicked = () => {navigate("/")}
    const handleRedirectToFAQPage = () => {navigate("/faq")}
    return (
        <div className={'px-6 my-2'}>
        <h1 className={'text-lg text-black font-bold mb-8'}>Sobre Dónde</h1>
        <p className={'text-base text-justify mb-6'}>
            <strong>Dónde</strong> es una plataforma que te permite encontrar servicios de salud en toda América Latina.
        </p>
        <p className={'text-base text-justify mb-6'}>
            Buscá el lugar más cercano para acceder a preservativos, métodos anticonceptivos, información sobre interrupción voluntaria del embarazo, test de ITS, vacunatorios y centros de infectología.
        </p>
        <p className={'text-base text-justify mb-6'}>
            Esta es una plataforma de código abierto pensada por Fundación Huésped.
        </p>
        <p className={'p-2 bg-ultra-light-salmon rounded-2xl text-center'}>
            Si tienes inquietudes, visitá nuestra sección de <button onClick={handleRedirectToFAQPage} className={'text-primary font-bold'}>preguntas frecuentes </button>
        </p>
        <Button className={'w-full my-5'} type={'secondary'} onClick={handleSearchButtonClicked}>
            Comenzar Búsqueda
        </Button>
        </div>
    );
};

export default About;