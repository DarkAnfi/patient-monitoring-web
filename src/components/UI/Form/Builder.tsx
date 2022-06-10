import React, { useRef } from 'react';
import { MenuItem } from '@material-ui/core';

import { useForm } from 'hooks/useForm';
import { Form, FormAttributes, FormProps } from '.';
import { FormInput, FormInputProps } from './Input';
import { FormOption, FormOptionProps } from './Option';

export interface FormBuilderProps {
  inputs: (Omit<FormInputProps, 'name' | 'value' | 'onChange'> & {
    name: string,
    value: string | number | boolean | Dict<boolean> | File[] | null;
    options?: Omit<FormOptionProps, 'type' | 'name' | 'onChange'>[];
  })[];
};

export const FormBuilder = React.forwardRef<FormAttributes, FormBuilderProps & Omit<FormProps, 'form' | 'ref'>>(({ inputs, children, ...formRest }, ref) => {
  const initialForm = useRef(Object.fromEntries(inputs.map(input => [input.name, input.value])));
  const { form, handleInputChange } = useForm(initialForm.current);
  return (
    <Form ref={ref} form={form} onChange={handleInputChange} {...formRest}>
      {inputs.map(
        input => {
          const { name, value: inputValue, error, options, ...inputRest } = input;
          if (!options) return <FormInput key={name} {...inputRest} />;
          return (
            <FormInput key={name} {...inputRest}>
              {options.map(
                (option, index) => {
                  const { value: optionValue, label, ...optionRest } = option;
                  if (inputRest.type === 'select') return <MenuItem key={`${optionValue}`} value={`${optionValue}`} {...optionRest} children={label} />;
                  return <FormOption key={Object.keys(inputValue ?? {})[index] ?? `${optionValue}`} {...option} />;
                }
              )}
            </FormInput>
          );
        }
      )}
      {children}
    </Form>
  );
});