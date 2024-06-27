import {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {context} from '../store/context';

export default function Logout() {
    const ctx = useContext(context);

    return <Ionicons style={styles.logout} name='exit' size={25} color='#ffffff' onPress={ctx.logout}/>;
}

const styles = StyleSheet.create({
    logout: {
        marginRight: 15
    }
});
