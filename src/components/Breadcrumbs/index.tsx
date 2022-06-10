import { Breadcrumbs, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const renderBreadCrumbItem = (breadcrumb: BreadCrumbItem, index: number): JSX.Element => {
    if (breadcrumb.to) {
        return (<Typography key={`breacrumb-item-${index}`} sx={{
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline'
            }
        }} color='textSecondary' component={Link} to={`${breadcrumb.to}`} >
            {breadcrumb.title}
        </Typography>);
    } else return (<Typography key={`breacrumb-item-${index}`} color="textPrimary">{breadcrumb.title}</Typography>);
};

export const BreadcrumbsCustom = () => {
    const { breadcrumbs } = useSelector((state: RootState) => state.ui);

    return (
        <>
            {breadcrumbs.length > 1 && (
                <Breadcrumbs style={{
                    width: '100%',
                    padding: '20px 20px 0px 20px',
                }} separator="›" aria-label="breadcrumb">
                    {breadcrumbs.map((breadcrumb: BreadCrumbItem, index: number) => renderBreadCrumbItem(breadcrumb, index))}
                </Breadcrumbs>
            )}
        </>
    );
};
