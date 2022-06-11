import { Box, MenuItem } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Form } from 'components/UI/Form';
import { Section } from 'components/UI/Section';
import TableCustom from 'components/UI/Table';
import { useForm } from 'hooks/useForm';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openConfirmModal, setConfirmModalState } from 'redux/actions/ui';

export const HomeScreen: React.FC = () => {

    const dispatch = useDispatch();
    const { patients } = useSelector<RootState, PatientState>(state => state.patient);

    const rows = patients.map((patient) => ({
        ...patient,
        id: patient._id,
    }));

    type Row = typeof rows[number];

    const onAdd = useCallback(() => {
        dispatch(setConfirmModalState({
            title: 'Ingresar Paciente',
            content: <AddPatientModal />,
            onConfirm: () => {
                const form = document.querySelector<HTMLFormElement>(`#add-patient-form`);
                if (!form) return false;
                form.dispatchEvent(new Event('submit', {
                    'bubbles': true,
                    'cancelable': true,
                }));
                return false;
            }
        }));
        dispatch(openConfirmModal());
    }, [dispatch]);

    const onEdit = useCallback((row: Row) => {

    }, []);

    const onDelete = useCallback((row: Row) => {

    }, []);

    const onNavigate = useCallback((row: Row) => {

    }, []);

    const headersTable = {
        name: { type: 'text', label: 'Nombre', width: 300 },
        age: { type: 'text', label: 'Edad', width: 88 },
        prevision: { type: 'text', label: 'Previsión', width: 116 },
        derivedFrom: { type: 'text', label: 'Derivado desde', width: 300 },
        reason: { type: 'text', label: 'Razón derivación', flex: 1 },
        actions: {
            type: 'actions',
            buttons: [
                { type: 'iconButton', icon: 'visibility', onClick: onNavigate },
                { type: 'iconButton', icon: 'edit', onClick: onEdit },
                { type: 'iconButton', icon: 'delete', onClick: onDelete },
            ],
            width: 128,
        }
    };

    const configTable = {
        selectable: false,
        pagination: true,
        disableColumnMenu: true,
        disablePDFButton: true,
    };

    return (
        <>
            <Section label='Pacientes' actions={[
                { label: 'Ingresar', materialColor: 'primary', icon: <Add />, onClick: onAdd }
            ]}>
                <Box width='100%' position='relative'>
                    <TableCustom rows={rows} title='Pacientes' headersTable={headersTable} configTable={configTable} loading={false} height={650} />
                </Box>
            </Section>
        </>
    );
};

const initialAddPatientForm = {
    name: '' as string,
    age: '' as string,
    prevision: 'placeholder' as string,
    derivedFrom: '' as string,
    reason: '' as string,
    observation: '' as string,
};


const AddPatientModal: React.FC = () => {
    const { form, handleInputChange } = useForm(initialAddPatientForm);

    type AddPatientForm = typeof form;

    const onSubmit = useCallback((form: AddPatientForm) => {
        console.log(form);
    }, []);

    return (
        <>
            <Form form={form} onChange={handleInputChange} id='add-patient-form' onSubmit={onSubmit}>
                <Form.Input label='Nombre' type='text' max={255} fullWidth
                    validate={(value) => {
                        if (!value) return 'El campo es requerido';
                        return '';
                    }}
                />
                <Form.Input label='Edad' type='numeric' max={2} fullWidth
                    validate={(value) => {
                        if (!value) return 'El campo es requerido';
                        return '';
                    }}
                />
                <Form.Input label='Previsión' type='select' placeholder='Seleccione tipo de previsión' fullWidth
                    validate={(value) => {
                        if (!value || value === 'placeholder') return 'El campo es requerido';
                        return '';
                    }}
                >
                    <MenuItem value='Fonasa A'>Fonasa A</MenuItem>
                    <MenuItem value='Fonasa B'>Fonasa B</MenuItem>
                    <MenuItem value='Fonasa C'>Fonasa C</MenuItem>
                    <MenuItem value='Fonasa D'>Fonasa D</MenuItem>
                    <MenuItem value='Isapre'>Isapre</MenuItem>
                </Form.Input>
                <Form.Input label='Derivado desde' type='text' max={255} fullWidth
                    validate={(value) => {
                        if (!value) return 'El campo es requerido';
                        return '';
                    }}
                />
                <Form.Input label='Razón de derivación' type='text' max={255} fullWidth
                    validate={(value) => {
                        if (!value) return 'El campo es requerido';
                        return '';
                    }}
                />
                <Form.Input label='Breve historia clinica' type='textarea' max={2000} fullWidth
                    validate={(value) => {
                        if (!value) return 'El campo es requerido';
                        return '';
                    }}
                />
            </Form>
        </>
    );
};