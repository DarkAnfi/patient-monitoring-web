import { Reducer } from 'redux';
import patients from 'redux/types/patients';

const initialState: PatientState = {
    patients: [{
        _id: '1',
        name: 'Vicente Alcántara Bartolomé',
        age: 27,
        history: `- Alergia a la yema del huevo\n- Prediabetes`,
        prevision: 'Fonasa D',
        derivedFrom: 'Cesfam Pedro de Valdivia',
        reason: 'Tumor en el cuello',
        observation: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        events: [],
    }, {
        _id: '2',
        name: 'Trinidad Bustos Tamarit',
        age: 40,
        history: `- Diabetes tipo 2\n- Hipertensión arterial`,
        prevision: 'Isapre',
        derivedFrom: 'Cesfam Pedro de Valdivia',
        reason: 'Tumor en el hombro derecho',
        observation: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

        The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`,
        events: [],
    }],
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
                patients: state.patients.map<Patient>(patient => patient._id === payload._id ? { ...patient, ...payload } : patient)
            };
        case patients.deletePatient:
            return {
                ...state,
                patients: state.patients.filter(patient => patient._id !== payload._id)
            };
        default:
            return state;
    }
};