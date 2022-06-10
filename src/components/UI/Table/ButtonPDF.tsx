import { Page, Text, View, Document, StyleSheet, PDFViewer, Font } from '@react-pdf/renderer';
import { Button, Icon, } from '@mui/material';
import inconsolataLight from 'assets/font/inconsolata/static/Inconsolata/Inconsolata-Light.ttf';
import inconsolataBold from 'assets/font/inconsolata/static/Inconsolata/Inconsolata-Bold.ttf';
import { TableModal } from './TableModal';
import { useState } from 'react';

interface Props {
    rows: Dict[],
    headers: Dict,
    title: string,
    columnsSummaryDescription: Dict<Dict<Summary>[]>,
    fontSize: number,
}

const countRowByCell = (cell: string, width: number, characterSize: number = 6) => {
    const arrayWord = (cell ?? '').toString().trim().replace(/ +(?= )/g, '').split(' ');
    let countRow = 0;
    let acumulateSizeWord = 0;
    let sentenceAcumulate = '';
    let sentenceArray: string[] = [];
    arrayWord.forEach((word, i) => {
        // Se evalua si lleva o no espacio
        let localSpace = characterSize;
        if (arrayWord.length === 1 || i === arrayWord.length - 1) {
            localSpace = 0;
        }

        // Se asginan los valores correspondientes
        if (acumulateSizeWord === 0) {
            acumulateSizeWord = (word.length * characterSize) + localSpace;
            sentenceAcumulate = word + (localSpace === 0 ? '' : ' ');
        } else {
            acumulateSizeWord += (word.length * characterSize) + localSpace;
            sentenceAcumulate += word + (localSpace === 0 ? '' : ' ');
        }

        // Se evalua
        if (acumulateSizeWord > width) {
            // Para saber si con 1 palabra cumplo el rango necesario
            if (acumulateSizeWord - ((word.length * characterSize) + localSpace) === 0) {
                sentenceArray.push(sentenceAcumulate);
                sentenceAcumulate = '';
                acumulateSizeWord = 0;
            } else {
                sentenceAcumulate = sentenceAcumulate.slice(0, sentenceAcumulate.length - (word.length + (localSpace === 0 ? 0 : 1)));
                sentenceArray.push(sentenceAcumulate);
                sentenceAcumulate = word + (localSpace === 0 ? '' : ' ');
                acumulateSizeWord = ((word.length * characterSize) + localSpace);
            }

            countRow++;
        }

        // Se agrega fila del resto
        if (i === arrayWord.length - 1 && acumulateSizeWord !== 0) {
            sentenceArray.push(sentenceAcumulate);
            countRow++;
        }
    });

    return { sentence: sentenceArray.join('\n'), countRow };
};

export const ButtonPDF = ({ rows, title, headers, columnsSummaryDescription, fontSize, ...props }: Props) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const rowHeader: Array<JSX.Element> = [];
    const allPageTable: Array<JSX.Element>[][] = [];
    let keysColumns: string[] = [];

    if (rows.length > 0) {
        // Se inicializa el contenedor de todas las columnas de la tabla
        Object.keys(rows[0]).forEach((key) => {
            if (!headers[key]) return;
            if (!headers[key].widthPDF) return;
            keysColumns.push(key);
        });
        keysColumns = keysColumns.sort((a, b) => {
            if (!headers[a] || !headers[b]) return 0;
            if (!headers[a].indexPDF || !headers[b].indexPDF) return 0;
            return headers[a].indexPDF - headers[b].indexPDF;
        });
    }

    const totalWidthPDF = keysColumns.reduce((value, key) => (value + (headers[key]?.widthPDF ?? 140)), 0);
    const processRow = (row: Dict) => {
        let newRow: Dict = {};
        let maxHeightRow = 0;
        let maxQuantityRow = 0;
        const heightRow = 12;
        const padding = 2;
        Object.keys(row).forEach((key) => {
            if (keysColumns.includes(key)) {
                const { sentence, countRow } = countRowByCell(row[key], Math.floor(((headers[key]?.widthPDF ?? 140) * 747) / totalWidthPDF) - fontSize, fontSize / 2);
                newRow[key] = sentence;
                maxHeightRow = maxHeightRow < (countRow * heightRow) ? (countRow * heightRow) : maxHeightRow;
                maxQuantityRow = maxQuantityRow < countRow ? countRow : maxQuantityRow;
            }
        });
        newRow['newHeight'] = maxHeightRow + (padding * 2);
        newRow['maxQuantityRow'] = maxQuantityRow;
        return newRow;
    };

    if (rows.length > 0) {
        keysColumns.forEach((key, i) => {
            rowHeader.push(
                <View key={`header-${i}`} style={[styles.headerCell, (!!headers[key]?.widthPDF ? { 'width': headers[key]?.widthPDF } : { 'width': 140 })]}>
                    <Text>{headers[key].label}</Text>
                </View>
            );
        });

        let countHeightRows = 0;
        let listViewPage: JSX.Element[][] = [];

        rows.forEach((row, i) => {
            const newRow = processRow(row);
            const rowTable: JSX.Element[] = [];
            countHeightRows += newRow['maxQuantityRow'];

            keysColumns.forEach((key, j) => {
                rowTable.push(
                    <View key={`text-${key}-${i}-${j}`} style={[styles.cell, (!!headers[key]?.widthPDF ? { 'width': headers[key]?.widthPDF } : { 'width': 140 }), { height: `${newRow['newHeight']}px` }]}>
                        <Text >{!!headers[key] && !!headers[key].valueFormatter ? headers[key].valueFormatter({ value: newRow[key], row }) : newRow[key]}</Text>
                    </View>
                );
            });

            listViewPage.push(rowTable);

            if (countHeightRows >= 35) {
                const aux: JSX.Element[] | undefined = listViewPage.pop();
                allPageTable.push(listViewPage);
                listViewPage = [aux ?? []];
                countHeightRows = 0;
            }

            // Última vuelta
            if (i === rows.length - 1) {
                allPageTable.push(listViewPage);
                listViewPage = [];
                countHeightRows = 0;
            }
        });
    }

    const MyDocument =
        <Document>
            <Page
                size="LETTER"
                style={styles.page}
                orientation='landscape'
            >
                <View style={styles.body}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.divider}></View>
                    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            Object.entries(columnsSummaryDescription).map(([key, summary]: [string, Dict<Summary>[]]) => {
                                const headersDescription: JSX.Element[] = [];
                                const valuesDescription: JSX.Element[] = [];
                                summary.forEach((column) => {
                                    Object.keys(column).forEach((key) => {
                                        headersDescription.push(
                                            <Text key={`${key}-label`} style={[styles.cellDescription]}>{key}</Text>
                                        );
                                        valuesDescription.push(
                                            <Text key={`${key}-value`} style={[styles.cellDescription]}>{column[key]['value'] ?? 'Dato no encontrado...'}</Text>
                                        );
                                    });
                                });

                                return (
                                    <View key={key}>
                                        <Text key={`${key}-label`} style={[styles.cellDescription, styles.titleSummaryDescription]}>{key}</Text>
                                        <View style={styles.tableDescription}>
                                            <View style={styles.containerColumnsDescription}>
                                                <View style={styles.columnHeadersDescription}>
                                                    {headersDescription}
                                                </View>
                                                <View style={styles.columnValuesDescription}>
                                                    {valuesDescription}
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.divider}></View>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
                <View style={{
                    textAlign: 'center', position: 'absolute', bottom: '10px', fontSize: '8px', fontFamily: 'inconsolata'
                }}>
                    <Text style={{ paddingTop: '8px', width: '100%' }}>
                        Página 1/{allPageTable.length + 1}
                    </Text>
                </View>
            </Page>

            {
                allPageTable.map((page, i) => {
                    return (
                        <Page
                            key={`page-${i}`}
                            size="LETTER"
                            style={styles.page}
                            orientation='landscape'
                        >
                            <View style={{ ...styles.body, fontSize: `${fontSize}px` }}>
                                <View style={styles.table}>
                                    <View style={styles.row}>
                                        {rowHeader}
                                    </View>
                                    {
                                        page.map((row, j) => {
                                            return (
                                                <View key={`${j}`} style={styles.row} >
                                                    {row}
                                                </View>
                                            );
                                        })
                                    }
                                </View>
                            </View>

                            <View style={{
                                textAlign: 'center', position: 'absolute', bottom: '10px', fontSize: '8px', fontFamily: 'inconsolata'
                            }}>
                                <Text style={{ paddingTop: '8px', width: '100%' }}>
                                    Página {i + 2}/{allPageTable.length + 1}
                                </Text>
                            </View>
                        </Page>
                    );
                })
            }
        </Document>;

    return (
        <>
            <Button
                startIcon={<Icon>picture_as_pdf</Icon>}
                color='primary'
                size='small'
                onClick={() => setModalOpen(true)}
            >
                Descargar PDF
            </Button>

            <TableModal isOpen={isModalOpen} title={title} onClose={() => setModalOpen(false)} content={
                <PDFViewer width='100%' height='700px'>
                    {MyDocument}
                </PDFViewer>
            } />
        </>
    );
};

Font.register({
    family: 'inconsolata', fonts: [
        { src: inconsolataLight }, // font-style: normal, font-weight: normal
        { src: inconsolataBold, fontWeight: '700', },
    ]
});
Font.registerHyphenationCallback((w) => [w]);

const styles = StyleSheet.create({
    // GENERIC
    page: {
        width: '100%',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        margin: '8mm',
        fontSize: '8px',
        fontFamily: 'inconsolata',
    },
    title: {
        textAlign: 'center',
        fontSize: '12px',
    },
    divider: {
        width: '100%',
        height: '1px',
        marginTop: '6px',
        marginBottom: '6px',
    },
    // DESCRIPTION
    tableDescription: {
        display: "flex",
        flexDirection: "row",
    },
    containerColumnsDescription: {
        display: 'flex',
        flexDirection: 'row',
        paddingRight: '20px',
    },
    cellDescription: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    columnHeadersDescription: {
        paddingRight: '10px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    columnValuesDescription: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    titleSummaryDescription: {
        fontSize: '10px',
        marginTop: '6px',
        marginBottom: '6px',
    },
    // TABLE
    table: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        textAlign: 'center',
    },
    headerCell: {
        border: '1px solid black',
        display: 'flex',
        fontWeight: 'bold',
        // paddingLeft: '3px',
        paddingTop: '2px',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    cell: {
        border: '1px solid black',
        display: 'flex',
        // paddingLeft: '3px',
        paddingTop: '2px',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    }
});

