import { ChangeEventHandler, useEffect, useState } from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';

interface CustomSwitchProps {
    name: string;
    value: boolean;
    disabled?: boolean;
    label?: string;
    onChange?: (e: Dict) => void,
}

export const CustomSwitch = ({ name, label, value, disabled = false, onChange, ...rest }: CustomSwitchProps) => {
    const [state, setState] = useState<boolean>(value);

    useEffect(() => {
        setState(value);
    }, [value, setState]);

    const handleChange: ChangeEventHandler<any> = ( e ) => {
        setState(e.target.checked);
        if(onChange) onChange(e);
    };

    return (
            <FormControlLabel
                style={{ userSelect: 'none', marginBottom: 10}}
                disabled={disabled}
                control={<Switch
                    name={name}
                    checked={state}
                    onChange={handleChange}
                />}
                label={label}
                // labelPlacement='top'
            />
    );
};
