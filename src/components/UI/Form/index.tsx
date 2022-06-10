import { FormHelperText } from '@material-ui/core';
import React, { Children, cloneElement, isValidElement, useImperativeHandle, useRef } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { FormBuilder, FormBuilderProps } from './Builder';
import { FormInput, FormInputProps } from './Input';
import { FormOption, FormOptionProps } from './Option';

export type FormProps = Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'> & {
  form: any;
  error?: string;
  helper?: string;
  showBottomError?: boolean;
  onSubmit?: (form: any) => void;
};

export interface FormAttributes {
  validate: () => boolean;
}

interface FormPrefix {
  Input: React.FC<FormInputProps>;
  Option: React.FC<FormOptionProps>;
  Builder: React.ForwardRefExoticComponent<FormBuilderProps & Omit<FormProps, "ref" | "form"> & React.RefAttributes<FormAttributes>>;
}

const Form: React.ForwardRefExoticComponent<React.PropsWithoutRef<FormProps> & React.RefAttributes<FormAttributes>> & FormPrefix = React.forwardRef<FormAttributes, FormProps>(({ onSubmit, onChange, form, error, helper, showBottomError = false, children, ...rest }, ref) => {
  const formerror = useRef<Dict<string>>({});
  const _form = Object.entries(form);
  const [flag, setFlag] = useState(false);
  const reset = () => setFlag(!flag);
  const inputsref = useRef<Dict>({});
  const validate = useCallback(() => {
    Object.values(inputsref.current).forEach(input => {
      input.reset();
    });
    reset();
    let flagError = false;
    Object.values(formerror.current).forEach(
      value => {
        if (!!value) flagError = true;
      }
    );
    Object.keys(form).forEach((key) => {
      if (typeof form[key] === 'string') form[key] = form[key].trim();
    });
    return flagError;
  }, []);
  useImperativeHandle(
    ref,
    () => ({
      validate
    }),
    [],
  );
  const _onSubmit: React.FormEventHandler<HTMLFormElement> | undefined = !!onSubmit ? (event) => {
    event.preventDefault();
    const flagError = validate();
    if (!flagError) onSubmit(form);
  } : undefined;
  return <form onSubmit={_onSubmit} {...rest}>
    {
      Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        if (index >= _form.length) return child;
        let _props: object = {};
        if (_form[index][0] === error) {
          _props = { error: true, helper: helper ?? 'Unexpected error.' };
        }
        return cloneElement(child, { onChange, name: _form[index][0], value: _form[index][1], formerror, inputsref, ..._props });
      })
    }
    {showBottomError && !!error?.length && <FormHelperText error> * {!!helper?.length ? helper : 'Unexpected error.'}</FormHelperText>}
  </form>;
}) as any;
Form.Input = FormInput;
Form.Option = FormOption;
Form.Builder = FormBuilder;

export { Form, FormInput, FormOption, FormBuilder };
