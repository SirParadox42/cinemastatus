import {Image, StyleSheet, Text, View} from 'react-native';

export default function Movie(props) {
    return (
        <View style={styles.movie}>
            <View style={styles.rankContainer}>
                <View style={styles.rankingContainer}>
                    <Text style={[styles.rank, styles.font]}>{props.rank}</Text>
                </View>
                <Image style={styles.image} source={{uri: props.image}}/>
            </View>
            <Text style={[styles.font, styles.text]}>{props.title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    movie: {
        marginVertical: 10
    },

    rankContainer: {
        position: 'relative'
    },

    image: {
        height: 500,
        width: '100%',
        borderWidth: 5,
        borderColor: 'black',
        borderRadius: 10
    },

    rank: {
        fontSize: 25,
        padding: 5,
        color: 'white',
        backgroundColor: 'black',
        borderWidth: 3
    },

    rankingContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1,
        borderBottomLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 3
    },

    font: {
        fontFamily: 'Comfortaa'
    },

    text: {
        marginVertical: 10,
        fontSize: 17.5,
        textDecorationLine: 'underline'
    }
});