import { useState } from 'react';
import { Button, MenuItem } from '@material-ui/core';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { FileObject } from 'material-ui-dropzone';
import validator from 'validator';

import { useForm } from 'hooks/useForm';
import { Form } from 'components/UI/Form';
import { FormBuilderProps } from './Builder';

const initialError = { name: '', message: '' };

export const FormExample = () => {
  const [error, setError] = useState(initialError);
  const fullWidth = true;
  const inputs: FormBuilderProps['inputs'] = [
    { name: 'text', type: 'text', value: '', fullWidth },
    { name: 'email', type: 'email', value: '', fullWidth },
    { name: 'password', type: 'password', value: '', fullWidth },
  ];
  const onSubmit = (form: Dict) => {
    if (validator.isEmpty(form.text)) return setError({ name: 'text', message: 'El campo es requerido.' });
    if (validator.isEmpty(form.email)) return setError({ name: 'email', message: 'El campo es requerido.' });
    if (validator.isEmpty(form.password)) return setError({ name: 'password', message: 'El campo es requerido.' });
    setError(initialError);
  };
  return (
    <Form.Builder inputs={inputs} onSubmit={onSubmit} error={error.name} helper={error.message}>
      <Button type='submit' variant='contained' children='Submit' />
    </Form.Builder>
  );
};
