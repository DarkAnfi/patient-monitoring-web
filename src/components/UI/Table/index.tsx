import { Button, Chip, IconButton, LinearProgress, useTheme, Icon, Theme, Tooltip, makeStyles, Grid } from '@material-ui/core';
import { DataGrid, GridToolbarContainer, GridColDef, GridCellParams, GridOverlay, GridToolbarFilterButton, GridToolbarColumnsButton, GridToolbarExport, GridToolbarDensitySelector, GridRowParams, GridSelectionModel, GridRowId } from '@material-ui/data-grid';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import { ButtonMenu, Option } from '../ButtonMenu';
import moment from 'moment';
import { ButtonPDF } from './ButtonPDF';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { useState } from 'react';
import { GridToolbarLegend } from './GridToolbarLegend';

interface Props {
    rows: Dict[],
    headersTable: Dict,
    configTable: Dict,
    columnsSummaryDescription?: Dict<Dict<Summary>[]>,
    title?: string,
    height?: number,
    loading?: boolean,
    showToolbar?: boolean,
    showPagination?: boolean,
    headerButtons?: React.ReactNode,
    getRowClass?: (params: GridRowParams) => string,
    selectedIds?: GridRowId[],
    pdfTableFontSize?: number,
    onSelect?: ((param: GridSelectionModel) => void),
    legend?: { label: string; className: string; }[],
}

const loadingOverlayCustom = (): JSX.Element => {
    return (
        <GridOverlay>
            <div style={{ position: 'absolute', top: 0, width: '100%' }}>
                <LinearProgress />
            </div>
        </GridOverlay>
    );
};

const iconButtonAction = (icon: string, onClick: Function, row: Dict, index: number, disabled: boolean): JSX.Element => {
    return (
        <IconButton
            key={`iconButton-${index}-${icon}`}
            size="small"
            aria-label="delete"
            style={{ marginRight: 10 }}
            color="secondary"
            onClick={() => onClick(row)}
            disabled={disabled}
        >
            <Icon fontSize="small">{icon}</Icon>
        </IconButton>
    );
};

interface MenuButtonActionProps {
    options?: Dict[],
    row: Dict,
    index: number,
    icon?: string | React.ReactChild,
    text?: string,
    children?: (row: Dict) => React.ReactNode,
    disabled: boolean,
}

const menubuttonAction = ({ options, row, index, icon, text, children = (row) => <div></div>, disabled }: MenuButtonActionProps): JSX.Element => {
    const newOptions: Option[] = [];
    if (options) {
        options.forEach((opt: Dict, index: number) => {
            const newOption: Option = {
                label: opt.label,
                icon: opt.icon,
                onSelect: (opt.label !== 'divider') ? () => {
                    if (opt.onSelectOption) opt.onSelectOption(row);
                } : undefined,
            };
            newOptions.push(newOption);
        });
    }

    return (
        <ButtonMenu
            buttonStyle={{ marginRight: 10, height: 23, fontSize: 13 }}
            key={`menu-button-${index}-${row.id}`}
            size='small'
            buttonVariant='contained'
            buttonColor='primary'
            icon={icon}
            text={text}
            options={newOptions}
            disabled={disabled}
        >
            {!options && children(row)}
        </ButtonMenu>
    );
};

const buttonAction = (text: string, icon: string, onClick: Function, row: Dict, index: number, disabled: boolean): JSX.Element => {
    return (
        <Button
            key={`button-${index}-${text}`}
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 10, height: 23, fontSize: 13 }}
            startIcon={<Icon fontSize="small">{icon}</Icon>}
            onClick={() => onClick(row)}
            disabled={disabled}
        >
            {text}
        </Button>
    );
};

const getSwitchValue = (value: Dict, labelChip: string, theme: Theme): { iconChip: JSX.Element, styleChip: React.CSSProperties; } => {
    let iconChip: JSX.Element = <div></div>;
    let styleChip: React.CSSProperties = {
        fontSize: 13,
        height: 23,
        color: theme.palette.getContrastText(theme.palette.text.primary),
    };

    switch (value.states[labelChip]) {
        case 'warning':
            styleChip.backgroundColor = theme.palette.warning.main;
            iconChip = <WarningIcon style={{ width: 20, color: theme.palette.getContrastText(theme.palette.text.primary), paddingLeft: 5 }} />;
            break;

        case 'info':
            styleChip.backgroundColor = theme.palette.info.main;
            iconChip = <InfoIcon style={{ width: 20, color: theme.palette.getContrastText(theme.palette.text.primary), paddingLeft: 5 }} />;
            break;

        case 'error':
            styleChip.backgroundColor = theme.palette.error.main;
            iconChip = <ErrorIcon style={{ width: 20, color: theme.palette.getContrastText(theme.palette.text.primary), paddingLeft: 5 }} />;
            break;

        case 'success':
            styleChip.backgroundColor = theme.palette.success.main;
            iconChip = <CheckIcon style={{ width: 20, color: theme.palette.getContrastText(theme.palette.text.primary), paddingLeft: 5 }} />;
            break;

        default:
            styleChip.backgroundColor = theme.palette.success.main;
            iconChip = <CheckIcon style={{ width: 20, color: theme.palette.getContrastText(theme.palette.text.primary), paddingLeft: 5 }} />;
            break;

    }

    return { iconChip, styleChip };
};

const getActionValue = (value: Dict, row: Dict, index: number): JSX.Element[] => {
    let listButtonActions: JSX.Element[] = [];
    value.buttons.forEach((action: Dict) => {
        if (!!action.visible && !action.visible(row)) return;
        switch (action.type) {
            case 'iconButton':
                listButtonActions.push(iconButtonAction(action.icon, action.onClick, row, index, action.disabled ?? false));
                break;

            case 'button':
                listButtonActions.push(buttonAction(action.label, action.icon, action.onClick, row, index, action.disabled ?? false));
                break;
            case 'menuButton':
                listButtonActions.push(menubuttonAction({
                    options: action.options,
                    row,
                    index,
                    icon: action.icon,
                    text: action.text,
                    children: action.children,
                    disabled: action.disabled ?? false,
                }));
                break;
            default:
                break;
        }
    });

    return listButtonActions;
};

const renderCellExpandTextAndNumber = (params: GridCellParams, classes: ClassNameMap): JSX.Element => {
    let title = params.formattedValue?.toString() ?? '';
    if (params.field === 'date') title = moment(title).format('DD-MM-yyyy');

    return (
        <>
            <Tooltip title={title} aria-label={title} className="ellipsis">
                {
                    // !!params.formattedValue
                    !!params.formattedValue || params.formattedValue === 0
                        ? <div> {title} </div>
                        : <div className={classes.label}> - </div>
                }
            </Tooltip>
        </>
    );
};

export default function TableCustom({ headersTable,
    rows,
    configTable,
    height = 500,
    loading = false,
    title = 'Sin título',
    getRowClass,
    selectedIds,
    onSelect,
    headerButtons,
    columnsSummaryDescription = {},
    showToolbar = true,
    showPagination = true,
    pdfTableFontSize = 8,
    legend = [],
    ...props }: Props) {
    const theme = useTheme();
    let columns: GridColDef[] = [];
    const classes = useStyles();
    const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

    const toolbarCustom = () => {
        return (
            <div style={{ paddingLeft: 8, paddingTop: 5, paddingBottom: 10, paddingRight: 8 }}>
                <GridToolbarContainer>
                    <Grid container justifyContent='space-between' wrap='wrap' alignItems='center'>
                        <Grid item>
                            <Grid container wrap='wrap' spacing={1} alignItems='center'>
                                <Grid item><GridToolbarColumnsButton /></Grid>
                                <Grid item><GridToolbarFilterButton /></Grid>
                                <Grid item><GridToolbarDensitySelector /></Grid>
                                <Grid item><GridToolbarExport csvOptions={{
                                    delimiter: ';',
                                    fileName: `${title} - ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
                                    utf8WithBom: true
                                }} /></Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container wrap='wrap' spacing={1} alignItems='center'>
                                {!!legend && !!legend.length && <Grid item><GridToolbarLegend legend={legend} /></Grid>}
                                {!configTable.disablePDFButton && <Grid item><ButtonPDF rows={rows} title={title} headers={headersTable} columnsSummaryDescription={columnsSummaryDescription} fontSize={pdfTableFontSize} /></Grid>}
                                {!!headerButtons && <Grid item>{headerButtons}</Grid>}
                            </Grid>
                        </Grid>
                    </Grid>
                </GridToolbarContainer>
                {/* <GridToolbar style={{ display: 'flex', flexWrap: 'wrap' }} {...props} /> */}
            </div >
        );
    };

    Object.entries(headersTable).forEach((entry, index) => {
        const key = entry[0];
        const value = entry[1];
        const newHeader: GridColDef = { field: key };
        if (value.width) newHeader.width = value.width;
        else newHeader.flex = value.flex;
        newHeader.align = 'left';
        newHeader.headerAlign = 'left';
        newHeader.sortable = value.sortable ?? true;
        newHeader.description = value.description ?? '';
        newHeader.valueFormatter = value.valueFormatter;

        if (value.type !== 'actions') {
            newHeader.field = key;
            newHeader.headerName = value.label;
        }

        switch (value['type']) {
            case 'text':
                newHeader.renderCell = (params: GridCellParams) => renderCellExpandTextAndNumber(params, classes);
                break;

            case 'number':
                newHeader.renderCell = (params: GridCellParams) => renderCellExpandTextAndNumber(params, classes);
                break;

            case 'chip':
                newHeader.renderCell = (params: GridCellParams) => {
                    const labelChip = params.row[key];
                    if (!!value.visible && !value.visible(params.row)) return <div className={classes.label}> - </div>;
                    const { iconChip, styleChip } = getSwitchValue(value, labelChip, theme);

                    return (
                        <strong>
                            <Chip
                                avatar={iconChip}
                                label={labelChip}
                                style={styleChip}
                            />
                        </strong>
                    );
                };
                break;

            case 'actions':
                newHeader.field = 'actions';
                newHeader.headerName = 'Acciones';
                newHeader.sortable = false;
                newHeader.renderCell = (params: GridCellParams) => {
                    const listButtonActions = getActionValue(value, params.row, index);

                    return (
                        // <strong>
                        <>
                            {listButtonActions}
                        </>
                        // </strong> 
                    );
                };
                break;

            default:
                return;
        }
        columns.push(newHeader);
    });

    return (
        <div style={{ userSelect: 'none' }} {...props}>
            <div style={{ width: '100%', height }}>
                <DataGrid
                    checkboxSelection={configTable.selectable ?? true}

                    onSelectionModelChange={configTable.selectable ? (newSelectionModel) => {
                        if (!!onSelect) onSelect(newSelectionModel);
                        else setSelectionModel(newSelectionModel);
                    } : undefined}

                    selectionModel={configTable.selectable ? selectedIds ?? selectionModel : undefined}
                    autoPageSize={configTable.pagination ?? true}
                    disableColumnMenu={configTable.disableColumnMenu ?? false}
                    disableColumnFilter={configTable.disableColumnFilter ?? false}
                    loading={loading}
                    rows={rows}
                    getRowClassName={getRowClass}
                    columns={columns}
                    disableSelectionOnClick
                    density='compact'
                    onColumnVisibilityChange={(params: any) => {
                        // setTimeout(() => {
                        //     params.api.current.applyFilter({
                        //         columnField: params.field,
                        //         value: 'a',
                        //         operatorValue: 'equals',
                        //     });
                        //     params.api.current.deleteFilter({});
                        // }, 0);
                    }}
                    hideFooter={!showPagination}
                    localeText={{
                        toolbarDensity: 'Densidad',
                        toolbarDensityLabel: 'Tamaño',
                        toolbarDensityCompact: 'Pequeño',
                        toolbarDensityStandard: 'Mediano',
                        toolbarDensityComfortable: 'Largo',
                        toolbarColumns: 'Columnas',
                        toolbarExport: 'Exportar',
                        toolbarExportCSV: 'Descargar como CSV',
                        toolbarFilters: 'Filtros',
                        noResultsOverlayLabel: 'No se encontraron resultados...',
                        noRowsLabel: 'No se encontraron resultados...',
                        columnMenuFilter: 'Filtro',
                        columnMenuSortAsc: 'Ordenar ascendente',
                        columnMenuSortDesc: 'Ordenar descendente',
                        columnMenuUnsort: 'Quitar orden',
                        columnMenuShowColumns: 'Mostrar columnas',
                        columnMenuHideColumn: 'Ocultar columna',
                        columnsPanelTextFieldLabel: 'Buscar columna',
                        columnsPanelHideAllButton: 'Ocultar todas',
                        columnsPanelShowAllButton: 'Mostrar todas',
                        columnsPanelTextFieldPlaceholder: 'Columna...',
                        filterOperatorEquals: 'igual a',
                        filterOperatorContains: 'contiene',
                        filterOperatorStartsWith: 'comienza con',
                        filterOperatorEndsWith: 'termina con',
                        filterPanelInputLabel: 'Valor',
                        filterPanelInputPlaceholder: 'Filtrar valor',
                        filterPanelColumns: 'Columna',
                        filterPanelOperators: 'Operadores',
                        checkboxSelectionHeaderName: 'Caja selección'
                    }}
                    components={{
                        Toolbar: showToolbar ? toolbarCustom : undefined,
                        LoadingOverlay: loadingOverlayCustom,
                        NoRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </div>
        </div>
    );
}

function CustomNoRowsOverlay() {
    const classes = useStyles();

    return (
        <GridOverlay >
            <div className={classes.label}>No se encontraron resultados...</div>
        </GridOverlay>
    );
}

const useStyles = makeStyles(
    (theme: Theme) => ({
        label: {
            marginTop: theme.spacing(1),
            color: theme.palette.grey[500],
            fontStyle: 'italic',
        },
    })
);