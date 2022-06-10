import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';

interface TextEditableProps {
    name: string;
    value: string;
    label?: string;
    onSave?: (e: Dict) => void,
}

export const TextEditable = ({ name, label, value, onSave, ...rest }: TextEditableProps & TextFieldProps) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [text, setText] = useState<string>(value ?? '');

    useEffect(() => {
        setText(value);
    }, [value, setText]);

    const handleSave = useCallback(
        () => {
            const e  = {
                target: { name, value: text }
            };
            if(onSave) onSave(e);
            setEditing(false);
        },
        [name, onSave, text],
    );

    const handleEdit = () => {
        setEditing(true);
    };

    const handleChange: ChangeEventHandler<any> = ({ target }) => {
        setText(target.value);
    };

    return (
        <TextField
            name={name}
            label={label}
            disabled={!editing}
            value={text}
            onChange={handleChange}
            InputProps={{
                readOnly: !editing,
                endAdornment:
                    <IconButton
                        onClick={editing ? handleSave : handleEdit }
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {editing ? <Save /> : <Edit />}
                    </IconButton>
            }}
            {...rest}
        />
    )
};
