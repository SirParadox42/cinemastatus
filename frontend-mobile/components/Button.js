import {Pressable, StyleSheet, Text} from 'react-native';

export default function Button(props) {
    return (
        <Pressable style={({pressed}) => [styles.button, pressed && styles.pressed, props.buttonStyle]} onPress={props.onPress}>
            <Text style={[styles.text, styles.font, props.textStyle]}>{props.children}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#9d0000',
        padding: 5,
        borderRadius: 5,
        borderColor: 'white',
        borderWidth: 2,
        margin: 'auto',
        marginVertical: 2.5,
        display: 'block',
        justifyContent: 'center',
        
    },

    text: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },

    pressed: {
        opacity: 0.75
    },

    font: {
        fontFamily: 'Comfortaa'
    }
});