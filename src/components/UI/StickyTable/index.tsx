import { Box, BoxProps, Typography } from '@mui/material';


interface StickTableProps {
    headers: Dict<Header>,
    rows: Dict[],
}

export interface Header {
    label: string,
}

export const StickTable = ({ headers, rows, ...props }: StickTableProps & BoxProps) => {

    const renderHeaders = () => Object.entries(headers).map(([key, value]: [string, Header], index: number) => <div key={`sticky-table-header-${key}`} className="tableCol">{value.label}</div>);

    const renderCells = (row: Dict) => {
        return Object.entries(headers).map(([key, value]: [string, Header], index: number) => <div key={`sticky-table-cell-${key}`} className="tableCol">{row[key].value ?? '-'}</div>);
        // return Object.entries(row).map(([key, value]: [string, Dict], index: number) => <div key={`sticky-table-cell-${key}`} className="tableCol">{ value }</div>);
    };

    const renderRows = () => {
        return rows.map((row) => {
            return (<div key={`sticky-table-row-sticky-field-${row['stickyField'].key}`} className="tableRow">{renderCells(row)}</div>);
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            {
                rows.length <= 0 && <Box className="stickyTableContainer" {...props} position='absolute' top={0}>
                    <Box className='center-content' width='100%' minHeight={'58.98px'} {...props} marginTop={'31.02px'}>
                        <Typography className='italic' color='textSecondary'>No se han encontrado resultados...</Typography>
                    </Box>
                </Box>
            }
            <Box className="stickyTableContainer" {...props} position='absolute' top={0}>
                <div className="tableContainer">
                    <div className="tableHeader">
                        {renderHeaders()}
                    </div>
                    {rows.length > 0 && renderRows()}
                </div>
            </Box>
        </div>
    );
};
