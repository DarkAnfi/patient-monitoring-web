import { Checkbox, FormControlLabel, Radio, Switch } from '@material-ui/core';
import React from 'react';

export const FormOption: React.FC<FormOptionProps> = React.memo(({ type, value, name, label, disabled, onChange }) => {
  switch (type) {
    case 'radio':
      return (
        <FormControlLabel disabled={disabled} value={value || label} control={<Radio />} label={label || value} />
      );
    case 'checkbox':
      return (
        <FormControlLabel
          control={<Checkbox
            checked={value as boolean}
            onChange={onChange}
            name={name}
          />}
          label={label}
          disabled={disabled}
        />
      );
    case 'switch':
      return (
        <FormControlLabel
          control={<Switch
            checked={value as boolean}
            onChange={onChange}
            name={name}
          />}
          label={label}
          disabled={disabled}
        />
      );
    default:
      return <></>;
  }
});

export interface FormOptionProps {
  type?: 'radio' | 'checkbox' | 'switch' | 'select';
  value?: string | number | boolean | object;
  label?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (event: React.ChangeEvent<any>) => void;
}