import { useState } from 'react';

export const useForm = <T extends Object>(initialState: T) => {

    const [form, setForm] = useState(initialState);

    const reset = () => {
        setForm(initialState);
    };

    const handleInputChange: React.ChangeEventHandler<any> = ({ target }) => {
        const type = typeof (form as { [key: string]: any; })[target.name];
        setForm({
            ...form,
            [target.name]: type === 'boolean' ? target.checked : target.value
        });
    };

    return { form, handleInputChange, reset, setForm };

};
