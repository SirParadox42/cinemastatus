import {useContext} from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import Input from '../components/Input';
import useInput from '../hooks/useInput';
import Button from '../components/Button';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function Login(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [emailInput, emailValid, handleEmailChange] = useInput(input => true);
    const [passwordInput, passwordValid, handlePasswordChange] = useInput(input => true);

    const signup = () => props.navigation.navigate('Signup');
    const login = async() => {
        try {
            const response = await sendRequest('user/login', 'POST', JSON.stringify({email: emailInput, password: passwordInput}), {'Content-Type': 'application/json'});
            ctx.login(response.token, response.userId, response.image);
            props.navigation.navigate('Rankings');
        } catch(err) {
            Alert.alert('Authentication Error', err.message, [{text: 'Ok'}]);
        }
    };

    return (
        <ScrollView style={styles.main} alwaysBounceVertical={false}>
            <Text style={[styles.welcome, styles.font]}>Welcome to CinemaStatus!</Text>
            <Loading isLoading={isLoading}/>
            <View style={styles.form}>
                <Input input={{placeholder: 'Email', autoCorrect: false, autoCapitalize: false, value: emailInput, onChangeText: handleEmailChange}}/>
                <Input input={{placeholder: 'Password', autoCorrect: false, autoCapitalize: false, secureTextEntry: true, value: passwordInput, onChangeText: handlePasswordChange}}/>
                <Button onPress={login} buttonStyle={styles.button}>Login</Button>
                <Text style={styles.signup}>Don't have an account? <Text onPress={signup} style={styles.bold}>Signup</Text></Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 30
    },

    welcome: {
        fontSize: 30,
        textDecorationLine: 'underline',
        textAlign: 'center'
    },

    bold: {
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },

    form: {
        marginTop: 10
    },

    signup: {
        textAlign: 'center',
        margin: 10
    },

    font: {
        fontFamily: 'Comfortaa'
    },

    button: {
        width: 210,
        padding: 10
    }
});