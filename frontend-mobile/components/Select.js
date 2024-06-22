import {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select'
import useInput from '../hooks/useInput';

export default function Select(props) {
    const [input, valid, handleChange, handleBlur, handleSubmit, invalid, setInput] = useInput(input => input.length > 0 && props.ranking.filter(ranking => ranking.title === input).length < 2);
    const handleSelectChange = input => input === null || input === 'null' ? handleChange('') : handleChange(input);

    useEffect(() => {
        props.onSelect(props.i, input, input.length > 0 ? props.movies.find(movie => movie.title === input).image : '', valid, handleSubmit)
    }, [input]);
    useEffect(() => {
        if (props.title) {
            setInput(props.title);
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={[styles.number, styles.font]}>{props.i+1}</Text>
            <View style={styles.input}>
                <Text style={[styles.invalid, styles.font]}>{invalid && (input.length === 0 ? 'Movie selection can\'t be empty.' : 'Movie is already selected.')}</Text>
                <RNPickerSelect style={pickerSelectStyles} value={input} onValueChange={handleSelectChange} onClose={handleBlur} items={props.movies.map(movie => ({label: movie.title, value: movie.title}))} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end'
    },

    font: {
        fontFamily: 'Comfortaa'
    },

    invalid: {
        color: '#9c0404'
    },

    number: {
        fontSize: 30,
        margin: 10
    },

    input: {
        flex: 1
    }
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderColor: '#424242',
        backgroundColor: 'white',
        borderWidth: 3,
        fontSize: 15,
        padding: 10,
        borderRadius: 10,
        fontFamily: 'Comfortaa'
    },

    inputAndroid: {
        borderColor: '#424242',
        backgroundColor: 'white',
        borderWidth: 3,
        fontSize: 15,
        padding: 10,
        borderRadius: 10,
        fontFamily: 'Comfortaa'
    }
});