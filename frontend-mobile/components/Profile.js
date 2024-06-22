import {useContext} from 'react';
import {Image, StyleSheet} from 'react-native';
import {context} from '../store/context';
import {REACT_APP_BACKEND_URL} from '@env';

export default function Profile() {
    const ctx = useContext(context);

    return <Image style={styles.image} source={{uri: `${REACT_APP_BACKEND_URL}/${ctx.image}`}}/>;
}

const styles = StyleSheet.create({
    image: {
        borderRadius: '50%',
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'white'
    }
});