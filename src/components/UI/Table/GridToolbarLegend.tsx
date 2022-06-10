import { Box, Button, Grid, Icon } from "@mui/material";
import { useState } from "react";
import { TableModal } from "./TableModal";

interface GridToolbarLegendProps {
    legend: {
        label: string;
        className: string;
    }[];
}

export const GridToolbarLegend: React.FC<GridToolbarLegendProps> = ({ legend }) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    return (
        <>
            <Button
                startIcon={<Icon>view_list</Icon>}
                color='primary'
                size='small'
                onClick={() => setModalOpen(true)}
            >
                Leyenda
            </Button>
            <TableModal isOpen={isModalOpen} title={'Leyenda'} onClose={() => setModalOpen(false)} maxWidth='xs' content={
                <>
                    {legend.map(({ label, className }, index) => {
                        return (
                            <Grid container key={index} spacing={2} alignItems='center'>
                                <Grid item>
                                    <Box className={className} width='30px' height='20px' border='solid 1px' borderColor='#bdbdbd' />
                                </Grid>
                                <Grid item>
                                    {label}
                                </Grid>
                            </Grid>
                        );
                    })}
                </>
            } />
        </>
    );
};
