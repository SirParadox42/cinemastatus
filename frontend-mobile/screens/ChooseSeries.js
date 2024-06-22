import {useState, useEffect} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import useHttp from '../hooks/useHttp';
import Loading from '../components/Loading';
import Button from '../components/Button';

export default function ChooseSeries(props) {
    const [isLoading, sendRequest] = useHttp();
    const [series, setSeries] = useState([]);

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest('series');
                setSeries(response.series);
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
    }, []);

    return (
        <View style={styles.series}>
            <Loading isLoading={isLoading}/>
            <FlatList alwaysBounceVertical={false} data={series} renderItem={item => <Button textStyle={styles.button} onPress={() => props.navigation.navigate('New Ranking', {seriesId: item.item.id})}>{item.item.title}</Button>} keyExtractor={item => item.id}/>
        </View>
    );
}

const styles = StyleSheet.create({
    series: {
        backgroundColor: '#ffcaca',
        flex: 1
    },

    button: {
        fontSize: 20,
        padding: 7
    }
});