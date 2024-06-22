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

export default function NewRanking(props) {
    const ctx = useContext(context);
    const [isLoading, sendRequest] = useHttp();
    const [series, setSeries] = useState({title: '', movies: []});
    const [titleInput, titleValid, handleTitleChange, handleTitleBlur, handleTitleSubmit, titleInvalid] = useInput(input => input.length > 0);
    const [ranking, setRanking] = useState([]);

    const handleSelect = (index, title, image, valid, handleSubmit) => setRanking(prev => prev.map((movie, i) => i === index ? {title, image, valid, handleSubmit} : movie));
    const createRanking = async() => {
        handleTitleSubmit();
        ranking.forEach(movie => movie.handleSubmit());

        if (titleValid && ranking.every(movie => movie.valid) && noDuplicates(ranking.map(movie => movie.title))) {
            try {
                await sendRequest(`ranking/${props.route.params.seriesId}`, 'POST', JSON.stringify({title: titleInput, ranking: ranking.map(movie => ({title: movie.title, image: movie.image}))}), {'Content-Type': 'application/json', Authorization: `Bearer ${ctx.token}`});
                props.navigation.navigate('Rankings', {change: true});
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        }
    };

    useEffect(() => {
        const dataFetcher = async() => {
            try {
                const response = await sendRequest(`series/${props.route.params.seriesId}`);
                setSeries(response.series);
            } catch(err) {
                Alert.alert('Error', err.message, [{text: 'Ok'}]);
            }
        };

        dataFetcher();
        props.navigation.setOptions({headerBackTitle: 'Series'});
    }, []);
    useEffect(() => {
        if (series.movies.length > 0) {
            setRanking(series.movies.map(movie => ({title: '', image: '', valid: false, handleSubmit() {}})));
        }
    }, [series]);

    return (
        <View style={styles.form}>
            {isLoading ? <Loading style={styles.loading} isLoading={isLoading}/> : <Text style={styles.font}>New {series.title} Ranking</Text>}
            <Input message={titleInvalid ? 'Input can\'t be empty.' : ''} input={{placeholder: 'Title', autoCorrect: false, autoCapitalize: false, value: titleInput, onChangeText: handleTitleChange, onBlur: handleTitleBlur}}/>
            <FlatList style={styles.movies} alwaysBounceVertical={false} data={ranking} renderItem={item => <Select key={item.index} onSelect={handleSelect} i={item.index} ranking={ranking} movies={series.movies}/>} keyExtractor={(item, index) => index}/>
            {ranking.length > 0 && <Button buttonStyle={styles.button} textStyle={styles.text} onPress={createRanking}>Create Ranking</Button>}
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
        maxHeight: '72.5%',
        borderRadius: 10
    },

    button: {
        marginVertical: 10
    },

    text: {
        padding: 5,
        fontSize: 17.5
    }
});