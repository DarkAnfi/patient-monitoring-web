import { Reducer } from 'redux';
import patients from 'redux/types/patients';

const initialState: PatientState = {
    patients: [],
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