import {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View, Text} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import useHttp from '../hooks/useHttp';
import Ranking from '../components/Ranking';
import Loading from '../components/Loading';
import Input from '../components/Input';
import {context} from '../store/context';

export default function Rankings(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [rankings, setRankings] = useState([]);
    const [series, setSeries] = useState([]);
    const [ranking, setRanking] = useState('');
    const [title, setTitle] = useState('');
    const [empty, setEmpty] = useState(false);

    const handleTitleSubmit = e => setTitle(e.nativeEvent.text);
    const handleSeriesChange = series => setRanking(series);
    const handleDelete = async(id) => {
        try {
            await sendRequest(`ranking/${id}`, 'DELETE', null, {Authorization: `Bearer ${ctx.token}`});
            setRankings(prev => prev.filter(ranking => ranking.id !== id));
        } catch(err) {
            Alert.alert('Error', err.message, [{text: 'Ok'}]);
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            setEmpty(false);
            const response = await sendRequest(`ranking/${ranking.length > 0 ? `${series.find(series => series.title === ranking).id}/` : ''}${title.length > 0 ? title : 'empty'}`);
            const rankings = response.rankings;
            const randomRankings = [];
            let n = rankings.length;

            if (n === 0) {
                setEmpty(true);
            }

            for (let i = 0; i < n; i++) {
                const random = Math.floor(Math.random() * rankings.length);
                randomRankings.includes(rankings[random]) ? n++ : randomRankings.push(rankings[random]);
            }

            setRankings(randomRankings);
        };
        const cleanup = props.navigation.addListener('focus', dataFetcher);

        dataFetcher();
        return cleanup;
    }, [title, ranking, props.navigation]);
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
        <View style={styles.container}>
            <View style={styles.inputs}>
                <View>
                    <Text style={styles.font}>Movie Series</Text>
                    <RNPickerSelect style={pickerSelectStyles} onValueChange={input => input === null || input === 'null' ? handleSeriesChange('') : handleSeriesChange(input)} items={series.map((ranking, index) => ({label: ranking.title, value: ranking.title, key: index}))}/>
                </View>
                <Input style={styles.input} ranking message='Ranking Title' input={{autoCapitalize: false, autoCorrect: false, onSubmitEditing: handleTitleSubmit}}/>
            </View>
            {empty && <Text style={[styles.font, styles.text]}>No rankings created.</Text>}
            <Loading style={styles.loading} isLoading={isLoading}/>
            {rankings.length > 0 && <FlatList style={styles.rankings} data={rankings} renderItem={item => <Ranking use onDelete={() => handleDelete(item.item.id)} {...item.item}/>} keyExtractor={item => item.id}/>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffcaca',
        flex: 1,
        padding: 20
    },

    text: {
        textAlign: 'center',
        fontSize: 20,
        textDecorationLine: 'underline',
        marginBottom: 10
    },
    
    font: {
        fontFamily: 'Comfortaa',
    },

    inputs: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    input: {
        width: 160
    },

    loading: {
        position: 'absolute',
        padding: 20,
        top: 85,
        alignSelf: 'center'
    },

    rankings: {
        borderRadius: 10
    }
});
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        borderColor: '#424242',
        backgroundColor: 'white',
        borderWidth: 3,
        fontSize: 15,
        padding: 15,
        borderRadius: 10,
        fontFamily: 'Comfortaa',
        width: 160
    },

    inputAndroid: {
        borderColor: '#424242',
        backgroundColor: 'white',
        borderWidth: 3,
        fontSize: 15,
        padding: 15,
        borderRadius: 10,
        fontFamily: 'Comfortaa',
        width: 160
    }
});