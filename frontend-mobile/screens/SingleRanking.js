import {useEffect, useState} from 'react';
import {Alert, StyleSheet, View, Text, FlatList} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import useHttp from '../hooks/useHttp';
import useVote from '../hooks/useVote';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Movie from '../components/Movie';

export default function SingleRanking(props) {
    const [isLoading, sendRequest] = useHttp();
    const [liked, disliked, likes, dislikes, handleVote, setLikes, setDislikes, setId] = useVote([], [], null);
    const [ranking, setRanking] = useState({title: '', ranking: []});

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`ranking/single/${props.route.params.rankingId}`);
                setRanking(response.ranking);
                setLikes(response.ranking.likes);
                setDislikes(response.ranking.dislikes);
                setId(response.ranking.id);
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
        props.navigation.setOptions({headerBackTitle: 'Rankings'});
    }, []);

    return (
        <View style={styles.ranking}>
            {isLoading && <Loading isLoading={isLoading}/>}
            {ranking.ranking.length > 0 && (
                <>
                    <Text style={[styles.title, styles.font]}>{ranking.title}</Text>
                    <Text style={[styles.username, styles.font]}>{ranking.creator.username}</Text>
                    <View style={styles.buttons}>
                        <Button buttonStyle={styles.button} onPress={() => handleVote(liked ? 'unlike' : 'like')}>{likes.length} <Ionicons name='thumbs-up' size={20} color={liked ? '#ffcaca' : 'white'}/></Button>
                        <Button buttonStyle={styles.button} onPress={() => handleVote(disliked ? 'undislike' : 'dislike')}>{dislikes.length} <Ionicons name='thumbs-down' size={20} color={disliked ? '#ffcaca' : 'white'}/></Button>
                    </View>
                    <FlatList style={styles.movies} data={ranking.ranking} renderItem={item => <Movie rank={item.index+1} {...item.item}/>} keyExtractor={(item, index) => item.id} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    ranking: {
        padding: 20
    },

    title: {
        fontSize: 30,
        textDecorationLine: 'underline',
        marginBottom: 10
    },

    username: {
        fontSize: 20,
        textDecorationLine: 'underline'
    },
    
    font: {
        fontFamily: 'Comfortaa',
    },

    buttons: {
        flexDirection: 'row',
        width: 100,
        marginTop: 10,
        justifyContent: 'space-between'
    },

    button: {
        margin: 0
    },

    movies: {
        height: '75%',
        borderRadius: 10,
        marginTop: 15
    }
});