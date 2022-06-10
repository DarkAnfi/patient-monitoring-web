import { Box } from '@material-ui/core';
import TableCustom from 'components/UI/Table';
import { useSelector } from 'react-redux';

export const HomeScreen: React.FC = () => {

    const { patients } = useSelector<RootState, PatientState>(state => state.patient);

    const rows = patients.map((patient) => ({
        id: patient._id,
        name: patient.name,
    }));

    type Row = typeof rows[number];

    const headersTable = {
        id: { type: 'text', label: '#', with: 100, widthPDF: 100 },
        name: { type: 'text', label: 'Nombre', flex: 1, widthPDF: 100 },
        // actions: {
        //     type: 'actions',
        //     buttons: [
        //         { type: 'iconButton', icon: 'edit', onClick: onEdit },
        //         { type: 'iconButton', icon: 'delete', onClick: onDelete },
        //     ],
        //     flex: 1,
        // }
    };

    const configTable = {
        selectable: false,
        pagination: true,
        disableColumnMenu: true,
    };

    return (
        <>
            <Box width='100%' position='relative'>
                <TableCustom rows={rows} title='Casinos' headersTable={headersTable} configTable={configTable} loading={false} height={650} />
            </Box>
        </>
    );
};