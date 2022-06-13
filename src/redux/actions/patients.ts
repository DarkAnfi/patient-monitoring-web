import patients from "redux/types/patients";

export const createPatient = (patient: Patient): SyncAction => ({ type: patients.createPatient, payload: patient });

export const updatePatient = (patient: Partial<Patient>): SyncAction => ({ type: patients.updatePatient, payload: patient });

export const deletePatient = (patient: Partial<Patient>): SyncAction => ({ type: patients.deletePatient, payload: patient });

export const createPatientEvent = <T = any>(patientId: string, event: PatientEvent<T>): SyncAction => ({ type: patients.createPatientEvent, payload: { _id: patientId, event } });

export const updatePatientEvent = <T = any>(patientId: string, event: Partial<PatientEvent<T>>): SyncAction => ({ type: patients.updatePatientEvent, payload: { _id: patientId, event } });

export const deletePatientEvent = <T = any>(patientId: string, event: Partial<PatientEvent<T>>): SyncAction => ({ type: patients.deletePatientEvent, payload: { _id: patientId, event } });