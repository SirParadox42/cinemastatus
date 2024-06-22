import {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, View, FlatList, Text} from 'react-native';
import useHttp from '../hooks/useHttp';
import useInput from '../hooks/useInput';
import Loading from '../components/Loading';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import noDuplicates from '../util/hasDuplicates';
import {context} from '../store/context';

export default function UpdateRanking(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [series, setSeries] = useState({title: '', movies: []});
    const [titleInput, titleValid, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid, setTitleInput] = useInput(input => input.length > 0);
    const [ranking, setRanking] = useState([]);

    const handleSelect = (index, title, image, valid, handleSubmit) => setRanking(prev => prev.map((movie, i) => i === index ? {title, image, valid, handleSubmit} : movie));
    const updateRanking = async() => {
        handleTitleSubmit();
        ranking.forEach(movie => movie.handleSubmit());

        if (titleValid && ranking.every(movie => movie.valid) && noDuplicates(ranking.map(movie => movie.title))) {
            try {
                await sendRequest(`ranking/${props.route.params.rankingId}`, 'PATCH', JSON.stringify({title: titleInput, ranking: ranking.map(movie => ({title: movie.title, image: movie.image}))}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
                props.navigation.navigate('Rankings', {change: true});
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const seriesResponse = await sendRequest(`series/${props.route.params.seriesId}`);
                const rankingResponse = await sendRequest(`ranking/single/${props.route.params.rankingId}`);
                setSeries(seriesResponse.series);
                setTitleInput(rankingResponse.ranking.title);
                setRanking(rankingResponse.ranking.ranking.map(movie => ({...movie, valid: true, handleSubmit() {}})));
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
        props.navigation.setOptions({headerBackTitle: 'Ranking'});
    }, []);

    return (
        <View style={styles.form}>
            {isLoading ? <Loading style={styles.loading} isLoading={isLoading}/> : <Text style={styles.font}>Update {series.title} Ranking</Text>}
            <Input message={titleInvalid ? 'Input can\'t be empty.' : ''} input={{placeholder: 'Title', autoCorrect: false, autoCapitalize: false, value: titleInput, onChangeText: handleTitleChange, onBlur: handleTitleBlur}}/>
            <FlatList style={styles.movies} alwaysBounceVertical={false} data={ranking} renderItem={item => <Select title={item.item.title} key={item.index} onSelect={handleSelect} i={item.index} ranking={ranking} movies={series.movies}/>} keyExtractor={(item, index) => index}/>
            {ranking.length > 0 && <Button buttonStyle={styles.button} textStyle={styles.text} onPress={updateRanking}>Update Ranking</Button>}
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        padding: 20
    },

    font: {
        fontFamily: 'Comfortaa',
        fontSize: 20,
        textDecorationLine: 'underline',
        marginBottom: 10,
        textAlign: 'center'
    },

    movies: {
        maxHeight: '72.5%'
    },

    button: {
        marginVertical: 10
    },

    text: {
        padding: 5,
        fontSize: 17.5
    }
});