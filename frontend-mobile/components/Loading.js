import {Image, StyleSheet} from 'react-native';

export default function Loading(props) {
    return <Image style={[styles.image, props.isLoading ? styles.visible : styles.hidden, props.style]} source={{uri: 'https://i.pinimg.com/originals/49/23/29/492329d446c422b0483677d0318ab4fa.gif'}}/>;
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        position: 'relative',
        top: 5,
        height: 30,
        marginVertical: 0,
        marginHorizontal: 'auto',
    },

    visible: {
        opacity: 1
    },

    hidden: {
        opacity: 0
    }
});