import { Box, Button, makeStyles, TextField, BoxProps } from '@mui/material';
import { useState, useEffect } from 'react';
import validator from 'validator';

interface Props {
    label?: string,
    placeholder?: string,
    value?: string,
    error?: string | null,
    type?: 'numeric' | 'text',
    fullWidth?: boolean,
    labelButton?: string,
    clean?: boolean,
    uppercase?: boolean,
    validate?: (value: string) => string,
    onSearch?: (value: string, setError: React.Dispatch<React.SetStateAction<string>>) => void;
}

export const SearchInput: React.FC<Props & BoxProps> = ({ label, placeholder, type = 'text', value, error, fullWidth, validate, onSearch, labelButton='Buscar', clean=false, uppercase, ...props }) => {
    const classes = useStyles();
    const [v, setV] = useState<string>(value ?? '');
    const [e, setError] = useState<string>('');
    const [submited, setSubmited] = useState<boolean>(false);

    useEffect(
        () => {
            if(value) setV(value);
        },[value]
    );

    useEffect(
        () => {
            if(!!error && !e.length ) setError(error ?? '');
            else if ((error && error.length === 0 && submited) || (!error && submited)) {
                setError('');
                setSubmited(false);
            }
        },[error, e, submited]
    );

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if(e.target.value.length > 0 && type === 'numeric' && !validator.isNumeric(e.target.value, { no_symbols: true })) setError('Solo se aceptan números');
        else if(validate && !!validate(e.target.value)) setError(validate(e.target.value));
        else if (e) setError('');
        setV(e.target.value);
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const valid = isValid();
        if(type === 'numeric' && !validator.isNumeric(v, { no_symbols: true })) setError('Solo se aceptan números');
        else if(validate && !!validate(v)) return setError(validate(v));
        if(!valid) return;
        setError('');
        if(onSearch) onSearch(v.trim(), setError);
        setSubmited(true);
        if(clean) setV('');
    };

    const isValid = () => {
        if(type === 'numeric' && !validator.isNumeric(v, { no_symbols: true })) return false;
        if(validate) return !(!!validate(v));
        if(!v.trim().length) return false;
        return true;
    };

    return (
        <Box {...props}>
            <form onSubmit={handleSubmit} className={classes.root}>
                <TextField
                    className={classes.input}
                    inputProps={{ style: !!uppercase ? { textTransform: "uppercase" } : {} }}
                    size='small'
                    variant='outlined'
                    value={v}
                    onChange={handleChange}
                    label={label}
                    placeholder={placeholder}
                    error={!!e}
                    helperText={e}
                    fullWidth={fullWidth}
                    />
                <Button 
                    className={classes.button} 
                    type='submit' 
                    variant='contained' 
                    color='primary' 
                    disabled={!isValid()}
                    disableElevation 
                >
                    {labelButton}
                </Button>
            </form>
        </Box>
    );
};

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        height: 40,
        '& fieldset': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    },
    button: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        height: 40,
    },
}));