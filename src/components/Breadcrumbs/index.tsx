import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const renderBreadCrumbItem = (breadcrumb: BreadCrumbItem, classes: ClassNameMap, index: number): JSX.Element => {
    if (breadcrumb.to) {
        return (<Typography key={`breacrumb-item-${index}`} className={classes.link} color='textSecondary' component={Link} to={`${breadcrumb.to}`} >
            { breadcrumb.title}
        </Typography>);
    } else return (<Typography key={`breacrumb-item-${index}`} color="textPrimary">{breadcrumb.title}</Typography>);
};

export const BreadcrumbsCustom = () => {
    const classes = useStyles();
    const { breadcrumbs } = useSelector((state: RootState) => state.ui);

    return (
        <>
            { breadcrumbs.length > 1 && (
                <Breadcrumbs className={classes.root} separator="›" aria-label="breadcrumb">
                    { breadcrumbs.map((breadcrumb: BreadCrumbItem, index: number) => renderBreadCrumbItem(breadcrumb, classes, index)) }
                </Breadcrumbs>
            )}
        </>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: '20px 20px 0px 20px',
    },
    link: {
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));
