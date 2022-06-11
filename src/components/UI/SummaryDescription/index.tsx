import { makeStyles, Theme, Typography, useTheme } from "@material-ui/core";
import { v4 as uuid } from 'uuid';

interface Props {
    columns: Dict<Summary>[],
    headerPercentage?: number,
    fullWidth?: boolean;
}

export const SummaryDescription: React.FC<Props> = ({ columns, headerPercentage, fullWidth = false }) => {
    const theme = useTheme();
    const classes = useStyles({ columns: columns.length });

    //  Generación de estilos para textos de resumen dependiendo de si el texto es label o value.
    const getTextStyle = (isLabel: boolean, fontSize = theme.typography.body1.fontSize, color?: string, bold = false, italic = false): React.CSSProperties => {
        return {
            fontSize: fontSize,
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            color: color ? color : isLabel ? theme.palette.grey[500] : theme.palette.text.primary,
        };
    };

    //  Renderización de cada fila o par | label | value | de la tabla de resumen dependiendo de la columna que se esté iterando.
    const renderSummary = (column: Dict<Summary>) => {
        if (!Object.keys(column).length) return (<Typography>No hay datos en la columna</Typography>);
        const content: JSX.Element[] = [];
        Object.entries(column).forEach(([label, { value, fontSize, color, bold, italic, fontSizeValue, colorValue, boldValue, italicValue, children }]) => {
            content.push((<tr key={`summary-description-column-${uuid()}`}>
                <td className={classes.labels} style={!!headerPercentage ? { width: `calc(100vw * ${((headerPercentage) / 100)})` } : {}}>
                    <Typography style={{ ...getTextStyle(true, fontSize, color, bold, italic) }}>{label}</Typography>
                </td>
                <td className={classes.values} style={!!headerPercentage ? { width: `calc(100vw * ${((100 - headerPercentage) / 100)})` } : {}}>
                    {
                        !!children ? children : (value !== null && value !== undefined)
                            ? <Typography style={{ ...getTextStyle(false, fontSizeValue, colorValue, boldValue, italicValue) }} title={value}>{value}</Typography>
                            : <Typography style={{ ...getTextStyle(false, fontSizeValue, theme.palette.grey[500], false, true) }} title='Dato no encontrado...'> Dato no encontrado... </Typography>
                    }
                </td>
            </tr>));
        });
        return content;
    };

    //  Renderización de cada una de las columnas especificadas por parámetros.
    const renderColumns = () => {
        if (!columns.length) return (<Typography>No hay columnas</Typography>);
        return columns.map((column: Dict<Summary>, index: number) => (
            <table key={`summary-description-table-${uuid()}`} className={classes.column} style={{ paddingRight: 35, display: 'block', width: fullWidth ? '100%' : 'auto' }}>
                <tbody style={{ width: fullWidth ? '100%' : 'auto', display: 'table' }}>
                    {renderSummary(column)}
                </tbody>
            </table>
        ));
    };

    return <div className={classes.root}>{renderColumns()}</div>;
};

interface styleProps {
    columns: number;
}

const useStyles = makeStyles<Theme, styleProps>((theme) => ({
    root: {
        display: 'flex',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        }
    },
    column: {
        height: '100%',
        //paddingLeft: 10,
        //paddingRight: 10,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        }
    },
    labels: {
        display: 'flex',
        alignItems: 'flex-start',
        paddingRight: 10,
    },
    values: {
        whiteSpace: 'pre-line',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
}));