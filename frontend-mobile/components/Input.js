import {StyleSheet, TextInput, View, Text} from 'react-native';

export default function Input(props) {
    return (
        <View style={[styles.container, props.style]}>
            <Text style={[styles.font, !props.ranking && styles.invalid]}>{props.message}</Text>
            <TextInput style={[styles.input, styles.font]} {...props.input}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20
    },

    input: {
        borderColor: '#424242',
        backgroundColor: 'white',
        borderWidth: 3,
        fontSize: 15,
        padding: 15,
        borderRadius: 10
    },

    font: {
        fontFamily: 'Comfortaa'
    },

    invalid: {
        color: '#9c0404'
    }
});