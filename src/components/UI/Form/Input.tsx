import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, InputLabelProps, MenuItem, RadioGroup, Switch, TextField } from '@material-ui/core';
import { KeyboardDatePicker, KeyboardDateTimePicker, KeyboardTimePicker } from '@material-ui/pickers';
import { Schedule } from '@material-ui/icons';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { DropzoneArea } from 'material-ui-dropzone';
import React, { ChangeEvent, Children, cloneElement, isValidElement, useState } from 'react';
import validator from 'validator';
import { makeStyles } from '@material-ui/styles';

export const _validate = ({ type, value, validate, min, max, required }: FormInputProps) => {
  let result = '';
  let _value = value ?? '';
  switch (type) {
    case 'email':
      result = !!value && !validator.isEmail(`${value}`) ? 'Correo no valido.' : '';
      break;
    case 'tel':
      result = !!value && !validator.isMobilePhone(`${value}`) ? 'Teléfono no valido.' : '';
      break;
    case 'url':
      result = !!value && !validator.isURL(`${value}`) ? 'URL no valida.' : '';
      break;
    case 'alpha':
      result = !!value && !validator.isAlpha(`${value}`) ? 'Debe contener solo letras.' : '';
      break;
    case 'numeric':
      result = !!value && !validator.isNumeric(`${value}`, { no_symbols: true }) ? 'Debe contener solo números.' : '';
      break;
    case 'alphanumeric':
      result = !!value && !validator.isAlphanumeric(`${value}`) ? 'Debe contener solo letras y números.' : '';
      break;
    case 'date':
      result = !!value && value instanceof Date && !value.getTime() ? 'Fecha no valida.' : '';
      break;
    case 'time':
      result = !!value && value instanceof Date && !value.getTime() ? 'Hora no valida.' : '';
      break;
    case 'datetime':
      result = !!value && value instanceof Date && !value.getTime() ? 'Fecha y hora no valida.' : '';
      break;
    default:
      break;
  }
  if (!!result) return result;
  let _min = min;
  switch (type) {
    case 'number':
      result = value !== null && value !== undefined && _min !== null && _min !== undefined && value < _min ? `Debe ser mayor o igual a ${min}.` : '';
      break;
    case 'date':
      if (!!min && typeof min === 'string') _min = Date.parse(`${min} 00:00`);
      if (!!value && value instanceof Date && !!value.getTime()) value = value.getTime();
      result = value !== null && value !== undefined && _min !== null && _min !== undefined && typeof _min === 'number' && typeof value === 'number' && value < _min ? `Debe ser mayor o igual a ${min}.` : '';
      break;
    case 'time':
      if (!!min && typeof min === 'string') _min = Date.parse(`1970/01/01 ${min}`);
      if (!!value && value instanceof Date && !!value.getTime()) value = value.setFullYear(1970, 0, 1);
      result = value !== null && value !== undefined && _min !== null && _min !== undefined && typeof _min === 'number' && typeof value === 'number' && value < _min ? `Debe ser mayor o igual a ${min}.` : '';
      break;
    case 'datetime':
      if (!!min && typeof min === 'string') _min = Date.parse(`${min}`);
      if (!!value && value instanceof Date && !!value.getTime()) value = value.getTime();
      result = value !== null && value !== undefined && _min !== null && _min !== undefined && typeof _min === 'number' && typeof value === 'number' && value < _min ? `Debe ser mayor o igual a ${min}.` : '';
      break;
    case 'checkbox':
      if (!!value && typeof value === 'object') value = Object.values(value).reduce((a, b) => a + b);
      result = value !== null && value !== undefined && _min !== null && _min !== undefined && value < _min ? `Debe seleccionar un mínimo de ${min} opciones.` : '';
      break;
    case 'switch':
      if (!!value && typeof value === 'object') value = Object.values(value).reduce((a, b) => a + b);
      result = value !== null && value !== undefined && _min !== null && _min !== undefined && value < _min ? `Debe seleccionar un mínimo de ${min} opciones.` : '';
      break;
    default:
      if (!!value && typeof value === 'string') value = value.length;
      result = value !== '' && value !== null && value !== undefined && _min !== null && _min !== undefined && value < _min ? `Debe tener un largo mayor o igual a ${min}.` : '';
      break;
  }
  if (!!result) return result;
  let _max = max;
  switch (type) {
    case 'number':
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && value > _max ? `Debe ser menor o igual a ${max}.` : '';
      break;
    case 'date':
      if (!!max && typeof max === 'string') _max = Date.parse(`${max} 23:59`);
      if (!!value && value instanceof Date && !!value.getTime()) value = value.getTime();
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && typeof _max === 'number' && typeof value === 'number' && value > _max ? `Debe ser menor o igual a ${max}.` : '';
      break;
    case 'time':
      if (!!max && typeof max === 'string') _max = Date.parse(`1970/01/01 ${max}`);
      if (!!value && value instanceof Date && !!value.getTime()) value = value.setFullYear(1970, 0, 1);
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && typeof _max === 'number' && typeof value === 'number' && value > _max ? `Debe ser menor o igual a ${max}.` : '';
      break;
    case 'datetime':
      if (!!max && typeof max === 'string') _max = Date.parse(`${max}`);
      if (!!value && value instanceof Date && !!value.getTime()) value = value.getTime();
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && typeof _max === 'number' && typeof value === 'number' && value > _max ? `Debe ser menor o igual a ${max}.` : '';
      break;
    case 'checkbox':
      if (!!value && typeof value === 'object') value = Object.values(value).reduce((a, b) => a + b);
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && value > _max ? `Debe seleccionar un máximo de ${max} opciones.` : '';
      break;
    case 'switch':
      if (!!value && typeof value === 'object') value = Object.values(value).reduce((a, b) => a + b);
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && value > _max ? `Debe seleccionar un máximo de ${max} opciones.` : '';
      break;
    case 'file':
      if (!!value && value instanceof Array) value = value.length;
      result = value !== null && value !== undefined && _max !== null && _max !== undefined && value > _max ? `Debe seleccionar un máximo de ${max} archivos.` : '';
      break;
    default:
      if (!!value && typeof value === 'string') value = value.length;
      result = value !== '' && value !== null && value !== undefined && _max !== null && _max !== undefined && value > _max ? `Debe tener un largo menor o igual a ${max}.` : '';
      break;
  }
  if (!!result) return result;
  result = !!validate ? validate(_value) : '';
  return result;
};

export const FormInput: React.FC<FormInputProps> = React.memo(({ inputsref, type = 'text', style, name, label, helper, placeholder, disabled, error, margin = 'normal', fullWidth = false, min, max, required = false, validate, formerror, value, onChange, children, variant = 'standard', placeholderSelect = true }) => {
  const classes = useStyle();
  let _value: [string, any][];
  let _onChange: (event: ChangeEvent<any>) => void;
  const [errorMessage, setErrorMessage] = useState(!!formerror?.current ? formerror.current[`${name}`] : '');
  const preErrorMessage = _validate({ type, value, validate, min, max, required });
  if (!!inputsref) {
    inputsref.current[`${name}`] = {
      reset: () => {
        setErrorMessage(preErrorMessage)
      }
    };
  }
  if (!!formerror) formerror.current = ({ ...formerror.current, [`${name}`]: preErrorMessage });
  if (['email', 'number', 'password', 'search', 'tel', 'text', 'url', 'alpha', 'numeric', 'alphanumeric'].includes(type)) {
    return (
      <TextField
        type={type as InputTypes}
        name={name}
        label={label}
        helperText={!!errorMessage ? errorMessage : helper}
        placeholder={placeholder}
        style={style}
        disabled={disabled}
        error={error ?? !!errorMessage}
        margin={margin}
        fullWidth={fullWidth}
        value={value ? value : ''}
        variant={variant}
        onChange={(e) => {
          const _e = e as ChangeEvent<any>;
          setErrorMessage(_validate({ type, value: _e.target.value, validate, min, max, required }));
          !!onChange && onChange(_e);
        }}
      />
    );
  } switch (type) {
    case 'date':
      return (
        <KeyboardDatePicker
          name={name}
          label={label}
          helperText={!!errorMessage ? errorMessage : helper}
          placeholder={placeholder}
          disabled={disabled}
          minDate={min as string}
          maxDate={max as string}
          error={error ?? !!errorMessage}
          margin={margin}
          fullWidth={fullWidth}
          value={value as ParsableDate}
          onChange={(date) => {
            setErrorMessage(_validate({ type, value: date as any, validate, min, max, required }));
            !!onChange && onChange({ target: { value: date, name } } as React.ChangeEvent<any>);
          }}
          format="yyyy/MM/dd"
        />
      );
    case 'time':
      return (
        <KeyboardTimePicker
          name={name}
          label={label}
          helperText={!!errorMessage ? errorMessage : helper}
          placeholder={placeholder}
          disabled={disabled}
          error={error ?? !!errorMessage}
          margin={margin}
          fullWidth={fullWidth}
          value={value as ParsableDate}
          onChange={(date) => {
            setErrorMessage(_validate({ type, value: date as any, validate, min, max, required }));
            !!onChange && onChange({ target: { value: date, name } } as React.ChangeEvent<any>);
          }}
          format="HH:mm"
          keyboardIcon={<Schedule />}
        />
      );
    case 'datetime':
      return (
        <KeyboardDateTimePicker
          name={name}
          label={label}
          helperText={!!errorMessage ? errorMessage : helper}
          placeholder={placeholder}
          disabled={disabled}
          minDate={min as string}
          maxDate={max as string}
          error={error ?? !!errorMessage}
          margin={margin}
          fullWidth={fullWidth}
          value={value as ParsableDate}
          onChange={(date) => {
            setErrorMessage(_validate({ type, value: date as any, validate, min, max, required }));
            !!onChange && onChange({ target: { value: date, name } } as React.ChangeEvent<any>);
          }}
          format="yyyy/MM/dd HH:mm"
        />
      );
    case 'textarea':
      return (
        <TextField
          type='text'
          multiline
          minRows={3}
          maxRows={5}
          name={name}
          label={label}
          style={style}
          helperText={!!errorMessage ? errorMessage : helper}
          placeholder={placeholder}
          disabled={disabled}
          error={error ?? !!errorMessage}
          margin={margin}
          fullWidth={fullWidth}
          value={value}
          variant={variant}
          onChange={(e) => {
            const _e = e as ChangeEvent<any>;
            setErrorMessage(_validate({ type, value: _e.target.value, validate, min, max, required }));
            !!onChange && onChange(_e);
          }}
        />
      );
    case 'radio':
      return (
        <FormControl disabled={disabled} error={error ?? !!errorMessage} margin={margin} fullWidth={fullWidth}>
          {!!label && <FormLabel>{label}</FormLabel>}
          <RadioGroup name={name} value={value} onChange={(e) => {
            const _e = e as ChangeEvent<any>;
            setErrorMessage(_validate({ type, value: _e.target.value, validate, min, max, required }));
            !!onChange && onChange(_e);
          }}>
            {Children.map(children, child => isValidElement(child)
              ? cloneElement(child, { type })
              : child)}
          </RadioGroup>
          {(!!helper || !!errorMessage) && <FormHelperText>{!!errorMessage ? errorMessage : helper}</FormHelperText>}
        </FormControl>
      );
    case 'checkbox':
      if (!!children) {
        _value = Object.entries(value as object);
        _onChange = ({ target }: ChangeEvent<any>) => {
          setErrorMessage(_validate({ type, value: target.value, validate, min, max, required }));
          !!onChange && onChange({ target: { value: { ...value as object, [target.name]: target.checked }, name } } as ChangeEvent<any>);
        };
        return (
          <FormControl disabled={disabled} error={error ?? !!errorMessage} margin={margin} fullWidth={fullWidth}>
            {!!label && <FormLabel>{label}</FormLabel>}
            <FormGroup>
              {Children.map(children, (child, index) => isValidElement(child)
                ? cloneElement(child, {
                  type, name: _value[index][0], value: _value[index][1], onChange: _onChange
                })
                : child)}
            </FormGroup>
            {(!!helper || !!errorMessage) && <FormHelperText>{!!errorMessage ? errorMessage : helper}</FormHelperText>}
          </FormControl>
        );
      } else {
        return (
          <FormControlLabel
            control={<Checkbox
              checked={!!value}
              onChange={(e) => {
                const _e = e as ChangeEvent<any>;
                setErrorMessage(_validate({ type, value: _e.target.value, validate, min, max, required }));
                !!onChange && onChange(_e);
              }}
              name={name}
            />}
            label={label}
            disabled={disabled}
          />
        );
      }
    case 'switch':
      if (!!children) {
        _value = Object.entries(value as object);
        _onChange = ({ target }: ChangeEvent<any>) => {
          setErrorMessage(_validate({ type, value: target.value, validate, min, max, required }));
          !!onChange && onChange({ target: { value: { ...value as object, [target.name]: target.checked }, name } } as ChangeEvent<any>);
        };
        return (
          <FormControl disabled={disabled} error={error ?? !!errorMessage} margin={margin} fullWidth={fullWidth}>
            {!!label && <FormLabel>{label}</FormLabel>}
            <FormGroup>
              {Children.map(children, (child, index) => isValidElement(child)
                ? cloneElement(child, {
                  type, name: _value[index][0], value: _value[index][1], onChange: _onChange
                })
                : child)}
            </FormGroup>
            {(!!helper || !!errorMessage) && <FormHelperText>{!!errorMessage ? errorMessage : helper}</FormHelperText>}
          </FormControl>
        );
      } else {
        return (
          <Box style={{ marginTop: '16px' }}>
            <FormControlLabel
              control={<Switch
                checked={!!value}
                onChange={(e) => {
                  const _e = e as ChangeEvent<any>;
                  setErrorMessage(_validate({ type, value: _e.target.value, validate, min, max, required }));
                  !!onChange && onChange(_e);
                }}
                name={name}
              />}
              label={label}
              labelPlacement='start'
              disabled={disabled}
              classes={{ labelPlacementStart: classes.marginLeft0, label: classes.marginRight5 }}
            />
          </Box>
        );
      }
    case 'select':
      return (
        <TextField
          select
          name={name}
          label={label}
          helperText={!!errorMessage ? errorMessage : helper}
          placeholder={placeholder}
          style={style}
          disabled={disabled}
          error={error ?? !!errorMessage}
          margin={margin}
          fullWidth={fullWidth}
          value={value}
          variant={variant}
          onChange={(e) => {
            const _e = e as ChangeEvent<any>;
            setErrorMessage(_validate({ type, value: _e.target.value, validate, min, max, required }));
            !!onChange && onChange(_e);
          }}
        >
          {!!placeholder && <MenuItem value='placeholder' disabled={placeholderSelect} children={placeholder} />}
          {Children.map(children, child => isValidElement(child)
            ? cloneElement(child, { type })
            : child)}
        </TextField>
      );
    case 'file': // TODO:
      return (
        <FormControl disabled={disabled} error={error ?? !!errorMessage} margin={margin} fullWidth={fullWidth}>
          {/* <DropzoneAreaBase
            fileObjects={value as FileObject[]}
            onAdd={(newFiles) => {
              !!onChange && onChange({ target: { value: [...(value as FileObject[]), ...newFiles], name: 'files' } } as React.ChangeEvent<any>);
            }}
            onDelete={(_, i) => {
              !!onChange && onChange({ target: { value: (value as FileObject[]).filter((_, j) => i !== j), name: 'files' } } as React.ChangeEvent<any>);
            }}
            dropzoneText={label}
            filesLimit={max as number}
            clearOnUnmount
          /> */}
          <DropzoneArea
            acceptedFiles={['image/*']}
            dropzoneText={label}
            filesLimit={max as number}
            initialFiles={value as File[]}
            inputProps={{ name }}
            onChange={(files) => {
              setErrorMessage(_validate({ type, value: files, validate, min, max, required }));
              !!onChange && onChange({ target: { value: files, name: name } } as React.ChangeEvent<any>);
            }}
          />
        </FormControl >
      );
    default:
      return <></>;
  }
});

export type InputTypes = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'alpha' | 'numeric' | 'alphanumeric';
export type DateTimeTypes = 'datetime' | 'date' | 'time';
export type AltTypes = 'textarea' | 'radio' | 'checkbox' | 'switch' | 'select' | 'file';

export interface FormInputProps {
  type?: InputTypes | DateTimeTypes | AltTypes | string;
  name?: string;
  label?: string;
  helper?: string;
  placeholder?: string;
  placeholderSelect?: boolean,
  disabled?: boolean;
  error?: boolean;
  margin?: 'dense' | 'none' | 'normal';
  style?: React.CSSProperties | undefined;
  fullWidth?: boolean;
  min?: number | string | null;
  max?: number | string | null;
  required?: boolean;
  value?: string | number | boolean | Dict<boolean> | File[] | null;
  formerror?: React.MutableRefObject<Dict<string>>;
  inputsref?: React.MutableRefObject<Dict<any>>;
  variant?: 'standard' | 'filled' | 'outlined';
  InputLabelProps?: InputLabelProps;
  onChange?: (event: ChangeEvent<any>) => void;
  validate?: (value: string | number | boolean | Dict<boolean> | File[]) => string;
}

const useStyle = makeStyles((theme) => ({
  marginLeft0: {
    marginLeft: '0px !important',
  },
  marginRight5: {
    marginRight: '5px !important'
  },
}));