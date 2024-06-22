import {useState} from 'react';

export default function useInput(validation) {
    const [input, setInput] = useState('');
    const [touched, setTouched] = useState(false);
    const valid = validation(input);
    const invalid = !valid && touched;

    const handleChangeText = input => setInput(input);
    const handleBlur = () => setTouched(true);
    const handleSubmit = () => setTouched(valid ? false : true);

    return [input, valid, handleChangeText, handleBlur, handleSubmit, invalid, setInput, setTouched];
}