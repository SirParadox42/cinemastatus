import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import useHttp from '../hooks/useHttp';
import Ranking from '../components/Ranking';
import Loading from '../components/Loading';
import {context} from '../store/context';

export default function UserRankings(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [rankings, setRankings] = useState([]);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                setEmpty(false);
                const response = await sendRequest('ranking/empty');
                const userRankings = response.rankings.filter(ranking => ranking.creator.id === ctx.userId);
                userRankings.length === 0 ? setEmpty(true) : setRankings(userRankings);
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };
        const cleanup = props.navigation.addListener('focus', dataFetcher);

        dataFetcher();
        return cleanup;
    }, []);

    return (
        <View style={styles.container}>
            {empty && <Text style={styles.font}>No rankings created.</Text>}
            {!empty && (isLoading ? <Loading isLoading={isLoading}/> : <Text style={styles.font}>Your Rankings</Text>)}
            {!isLoading && rankings.length > 0 && <FlatList data={rankings} renderItem={item => <Ranking onDelete={() => {}} {...item.item}/>} keyExtractor={item => item.id}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffcaca',
        flex: 1,
        padding: 20
    },

    font: {
        fontFamily: 'Comfortaa',
        textAlign: 'center',
        fontSize: 20,
        textDecorationLine: 'underline',
        marginBottom: 10
    }
});