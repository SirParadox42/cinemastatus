import {useContext, useEffect} from 'react';
import {StyleSheet, View, Text, Pressable, Alert} from 'react-native';
import Button from './Button';
import useVote from '../hooks/useVote';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {context} from '../store/context';

export default function Ranking(props) {
    const ctx = useContext(context);
    const navigation = useNavigation();
    const [liked, disliked, likes, dislikes, handleVote, setLikes, setDislikes, setId] = useVote([], [], null);

    const handleView = () => navigation.navigate('Ranking', {rankingId: props.id});
    const handleEdit = () => navigation.navigate('Update Ranking', {rankingId: props.id, seriesId: props.series.id});
    const handleDelete = () => Alert.alert('Deleting Ranking', `Are you sure you want to delete ${props.title}?`, [{text: 'No', style: 'cancel'}, {text: 'Yes', onPress: props.onDelete, style: 'destructive'}]);

    useEffect(() => {
        const dataSetter = () => {
            setLikes(props.likes);
            setDislikes(props.dislikes);
            setId(props.id);
        };
        const cleanup = navigation.addListener('focus', dataSetter);

        dataSetter();
        return cleanup;
    }, [navigation, props.likes, props.dislikes, props.userId]);

    return (
        <Pressable onPress={handleView} style={({pressed}) => [styles.post, pressed && styles.pressed]}>
            <View style={styles.titleContainer}>
                <Text style={[styles.font, styles.title]}>{props.title}</Text>
                <Text style={[styles.font, styles.username]}>{props.creator.username}</Text>
            </View>
            <View>
                <Text style={[styles.series, styles.font]}>{props.series.title} Series</Text>
                {props.use && (
                    <View style={styles.buttons}>
                        {ctx.userId === props.creator.id && (
                            <>
                                <Button onPress={handleEdit} buttonStyle={styles.button}><Ionicons name='create' size={20} color='white'/></Button>
                                <Button onPress={handleDelete} buttonStyle={styles.button}><Ionicons name='trash' size={20} color='white'/></Button>
                            </>
                        )}
                        <Button buttonStyle={styles.button} onPress={() => handleVote(liked ? 'unlike' : 'like')}>{likes.length} <Ionicons name='thumbs-up' size={15} color={liked ? '#ffcaca' : 'white'}/></Button>
                        <Button buttonStyle={styles.button} onPress={() => handleVote(disliked ? 'undislike' : 'dislike')}>{dislikes.length} <Ionicons name='thumbs-down' size={15} color={disliked ? '#ffcaca' : 'white'}/></Button>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    font: {
        fontFamily: 'Comfortaa',
        color: 'white'
    },

    title: {
        textAlign: 'center',
        fontSize: 20
    },

    titleContainer: {
        borderBottomWidth: 3,
        borderColor: 'white',
        padding: 20
    },

    post: {
        width: '100%',
        marginHorizontal: 'auto',
        marginVertical: 10,
        backgroundColor: '#9d0000',
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 10
    },

    pressed: {
        opacity: .75
    },

    series: {
        textAlign: 'center',
        padding: 10,
        color: 'white',
        fontSize: 13
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        borderTopWidth: 3,
        borderColor: 'white',
    },

    username: {
        textAlign: 'center',
        margin: 5,
        color: '#e2dede'
    },

    button: {
        margin: 5
    }
});
