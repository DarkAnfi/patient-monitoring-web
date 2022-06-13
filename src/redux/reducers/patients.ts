import { Reducer } from 'redux';
import patients from 'redux/types/patients';

const initialState: PatientState = {
    patients: [
        {
            _id: '2',
            name: 'Cristian Lopez Covili',
            age: 37,
            history: `TIENE EVALUACIONES CLINICAS Y DE MAGENES EN DESDE ENERO 2022 (PENDIENTES DE INFORME RADIOLOGICO)`,
            prevision: 'Fonasa D',
            derivedFrom: 'EVALUADO EN HHHA 15/03',
            reason: 'CUADRO DE AUMENTO DE VOLUMEN EN CARA MEDIAL MUSLO IZQUIERDO DESDE NOVIEMBRE 2021, ASOCIADO A CRECIMIENTO GRADUAL Y DOLOR',
            observation: `ES EVALUADO A APS Y DERIVADO PARA EVALUACIÓN EQUIPO TRAUMATOLOGIA TUMORES. SE INGRESA A LISTA ESTERA QUIRURGICA PARA BIOPSIA LESION`,
            events: [
                {
                    _id: '1',
                    type: 'entry',
                    data: null,
                    datetime: new Date(),
                } as PatientEvent<null>,
            ],
        },
        {
            _id: '1',
            name: 'Trinidad Bustos Tamarit',
            age: 40,
            history: `- Diabetes tipo 2
        - Hipertensión arterial`,
            prevision: 'Isapre',
            derivedFrom: 'Cesfam Pedro de Valdivia',
            reason: 'Tumor en el hombro derecho',
            observation: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in vestibulum ex. Maecenas eget diam urna. Vivamus in ex auctor, tempor lorem a, fermentum lacus. Ut vitae dictum libero. Nulla diam sem, pharetra vel ipsum sed, accumsan condimentum augue. Etiam maximus urna ut dui interdum tristique. Ut cursus dui non ligula imperdiet, vitae suscipit neque interdum. Integer auctor dictum lorem vitae finibus. Vivamus a vulputate mi, et posuere odio.`,
            events: [
                ({
                    _id: '1',
                    type: 'entry',
                    data: null,
                    datetime: new Date(),
                } as PatientEvent<null>),
            ],
        }
    ],
};

export const patientReducer: Reducer<PatientState, SyncAction> = (state = initialState, { type, payload }): PatientState => {
    switch (type) {
        case patients.createPatient:
            return {
                ...state,
                patients: [payload, ...state.patients]
            };
        case patients.updatePatient:
            return {
                ...state,
                patients: state.patients.map<Patient>(patient => patient._id === payload._id ? {
                    ...patient,
                    ...payload
                } : patient)
            };
        case patients.deletePatient:
            return {
                ...state,
                patients: state.patients.filter(patient => patient._id !== payload._id)
            };
        case patients.createPatientEvent:
            return {
                ...state,
                patients: state.patients.map<Patient>(patient => patient._id === payload._id ? {
                    ...patient,
                    events: [
                        ...patient.events,
                        payload.event
                    ]
                } : patient)
            };
        case patients.updatePatientEvent:
            return {
                ...state,
                patients: state.patients.map<Patient>(patient => patient._id === payload._id ? {
                    ...patient,
                    events: patient.events.map<PatientEvent>(event => event._id === payload.event._id ? {
                        ...event,
                        ...payload.event
                    } : event)
                } : patient)
            };
        case patients.deletePatientEvent:
            return {
                ...state,
                patients: state.patients.map<Patient>(patient => patient._id === payload._id ? {
                    ...patient,
                    events: patient.events.filter(event => event._id !== payload.event._id)
                } : patient)
            };
        default:
            return state;
    }
};