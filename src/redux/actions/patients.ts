import patients from "redux/types/patients";

export const createPatient = (patient: Patient): SyncAction => ({ type: patients.createPatient, payload: patient });

export const updatePatient = (patient: Patient): SyncAction => ({ type: patients.updatePatient, payload: patient });

export const deletePatient = (patient: Patient): SyncAction => ({ type: patients.deletePatient, payload: patient });