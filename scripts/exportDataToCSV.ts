import { Day, EstablishmentStatus, ServiceOnEstablishmentOpeningTime } from "@prisma/client";
import { Establishment } from "../model/establishment";
import { ServiceName } from "../model/services";
import { formatEstablishmentType } from "../utils/establishments";

export const CSVHeaders = [
    { label: 'ID Oficial', key: 'officialId' },
    { label: 'ID FH', key: 'legacyId' },
    { label: 'establecimiento', key: 'name' },
    { label: 'tipo', key: 'type' },
    { label: 'calle', key: 'street' },
    { label: 'altura', key: 'streetNumber' },
    { label: 'piso_dpto', key: 'apartment' },
    { label: 'cruce', key: 'intersection' },
    { label: 'observacion establecimiento', key: 'details' },
    { label: 'web', key: 'website' },
    { label: 'ciudad', key: 'city' },
    { label: 'departamento', key: 'department' },
    { label: 'provincia', key: 'province' },
    { label: 'pais', key: 'country' },
    { label: 'estado', key: 'published' },
    { label: 'latitud', key: 'latitude'},
    { label: 'longitud', key: 'longitude'},
    { label: 'preservativos', key: 'preservativos'},
    { label: 'its', key: 'its'},
    { label: 'vacunatorio', key: 'vacunatorio'},
    { label: 'mac', key: 'mac'},
    { label: 'aborto', key: 'aborto'},
    { label: 'aborto_tipo', key: 'abortoSubservice'},
    { label: 'tel_preservativos', key: 'preservativosPhoneNumber'},
    { label: 'mail_preservativos', key: 'preservativosEmail'},
    { label: 'comentarios_preservativos', key: 'preservativosDetails'},
    { label: 'horario_preservativos', key: 'preservativosOpeningTimes'},
    { label: 'tel_its', key: 'itsPhoneNumber'},
    { label: 'mail_its', key: 'itsEmail'},
    { label: 'comentarios_its', key: 'itsDetails'},
    { label: 'horario_its', key: 'itsOpeningTimes'},
    { label: 'tel_vac', key: 'vacPhoneNumber'},
    { label: 'mail_vac', key: 'vacEmail'},
    { label: 'comentarios_vac', key: 'vacDetails'},
    { label: 'horario_vac', key: 'vacOpeningTimes'},
    { label: 'tel_mac', key: 'macPhoneNumber'},
    { label: 'mail_mac', key: 'macEmail'},
    { label: 'comentarios_mac', key: 'macDetails'},
    { label: 'horario_mac', key: 'macOpeningTimes'},
    { label: 'tel_aborto', key: 'abortoPhoneNumber'},
    { label: 'mail_aborto', key: 'abortoEmail'},
    { label: 'comentarios_aborto', key: 'abortoDetails'},
    { label: 'horario_aborto', key: 'abortoOpeningTimes'},
];

function formatOpeningTimeDay(openingTimeDay: Day) {
    switch(openingTimeDay) {
        case Day.M:
            return 'L';
        case Day.T:
            return 'M';
        case Day.W:
            return 'X';
        case Day.R:
            return 'J';
        case Day.F:
            return 'V';
        case Day.S:
            return 'S';
        case Day.U:
            return 'D';
    }
}
  

function formatOpeningTimesToCSVCellFormat(openingTimes: ServiceOnEstablishmentOpeningTime[]): string {
    let openingTimesString: string = '';
    let index = 0;
    for (const openingTime of openingTimes) {
        console.log(openingTime.endTime);
        let singleOpeningTimeString = formatOpeningTimeDay(openingTime.day) + '-' 
                                    + openingTime.startTime + '-' + openingTime.endTime;
        if (index < openingTimes.length - 1) {
            singleOpeningTimeString += '; ';
        }
        openingTimesString = openingTimesString.concat(singleOpeningTimeString);
        index++;
    }
    return openingTimesString;
}

function createCSVRecord(establishment: Establishment): any {
    const preservativosService = establishment.services.find((value) => value.service.name == ServiceName.PRESERVATIVOS);
    const macService = establishment.services.find((value) => value.service.name == ServiceName.MAC);
    const itsService = establishment.services.find((value) => value.service.name == ServiceName.ITS);
    const abortoService = establishment.services.find((value) => value.service.name == ServiceName.ABORTO);
    const vacService = establishment.services.find((value) => value.service.name == ServiceName.VACUNATORIOS);
    return {
        officialId: establishment.officialId,
        legacyId: establishment.legacyId,
        name: establishment.name,
        type: formatEstablishmentType(establishment),
        street: establishment.street,
        streetNumber: establishment.streetNumber,
        apartment: establishment.apartment,
        intersection: establishment.intersection,
        details: establishment.details,
        website: establishment.website,
        city: establishment.city,
        department: establishment.department,
        province: establishment.province,
        country: establishment.country,
        published: establishment.status == EstablishmentStatus.PUBLISHED ? '1' : '-1',
        latitude: establishment.latitude,
        longitude: establishment.longitude,
        preservativos: preservativosService ? 'SI' : 'NO',
        mac: macService ? 'SI' : 'NO',
        its: itsService ? 'SI' : 'NO',
        aborto: abortoService ? 'SI' : 'NO',
        vacunatorio: vacService ? 'SI' : 'NO',
        preservativosPhoneNumber: preservativosService?.phoneNumber,
        preservativosEmail: preservativosService?.email,
        preservativosDetails: preservativosService?.details,
        preservativosOpeningTimes: preservativosService?.openingTimes ? formatOpeningTimesToCSVCellFormat(preservativosService.openingTimes) : '',
        macPhoneNumber: macService?.phoneNumber,
        macEmail: macService?.email,
        macDetails: macService?.details,
        macOpeningTimes: macService?.openingTimes ? formatOpeningTimesToCSVCellFormat(macService.openingTimes) : '',
        itsPhoneNumber: itsService?.phoneNumber,
        itsEmail: itsService?.email,
        itsDetails: itsService?.details,
        itsOpeningTimes: itsService?.openingTimes ? formatOpeningTimesToCSVCellFormat(itsService.openingTimes) : '',
        abortoSubservice: abortoService?.subservice?.name ? abortoService.subservice.name : '',
        abortoPhoneNumber: abortoService?.phoneNumber,
        abortoEmail: abortoService?.email,
        abortoDetails: abortoService?.details,
        abortoOpeningTimes: abortoService?.openingTimes ? formatOpeningTimesToCSVCellFormat(abortoService.openingTimes) : '',
        vacPhoneNumber: vacService?.phoneNumber,
        vacEmail: vacService?.email,
        vacDetails: vacService?.details,
        vacOpeningTimes: vacService?.openingTimes ? formatOpeningTimesToCSVCellFormat(vacService.openingTimes) : '',
    }
}

export function formatEstablishmentsForExport(establishments: Establishment[]): any[] 
{
    let data: any[] = [];
    for (const establishment of establishments) {
        data.push(createCSVRecord(establishment));
    }
    return data;
}
