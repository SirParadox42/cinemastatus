import {useState, useEffect} from 'react';
import {View, Alert, StyleSheet, Text, Image} from 'react-native';
import {launchCameraAsync, launchImageLibraryAsync, useCameraPermissions, useMediaLibraryPermissions, PermissionStatus} from 'expo-image-picker';
import Button from './Button';

export default function ImagePicker(props) {
    const [pickedImage, setPickedImage] = useState(null);
    const [cameraPermissionInformation, requestCameraPermission] = useCameraPermissions();
    const [mediaPermissionInformation, requestMediaPermission] = useMediaLibraryPermissions();

    const verifyPermissions = async(permissionInformation, requestPermission) => {
        if (permissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }
        if (permissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert('Insufficient Permissions!', 'You need to grant camera permissions to use this app.');
            return false;
        }

        return true;
    };
    const takeImageHandler = async() => {
        const hasPermission = await verifyPermissions(cameraPermissionInformation, requestCameraPermission);

        if (!hasPermission) {
            return;
        }

        const image = await launchCameraAsync({allowsEditing: true, aspect: [16, 9], quality: 0.5});
        setPickedImage(image.assets[0].uri);
        props.onSelectImage(image.assets[0]);
    };
    const chooseImageHandler = async() => {
        const hasPermission = await verifyPermissions(mediaPermissionInformation, requestMediaPermission);

        if (!hasPermission) {
            return;
        }
        
        const image = await launchImageLibraryAsync({allowsEditing: true, aspect: [16, 9], quality: 0.5});
        setPickedImage(image.assets[0].uri);
        props.onSelectImage(image.assets[0]);
    };

    useEffect(() => {
        if (props.selectedImage === null) {
            setPickedImage(null);
        }
    }, [props.selectedImage]);

    let imagePreview = <Text style={[styles.font, styles.text]}>No image chosen yet.</Text>;

    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{uri: pickedImage}}/>
    }

    return (
        <View>
            <View style={styles.preview}>
                {imagePreview}
            </View>
            <View style={styles.container}>
                <Button onPress={takeImageHandler}>Take Image</Button>
                <Button onPress={chooseImageHandler}>Select Image</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 235,
        marginHorizontal: 'auto'
    },

    preview: {
        width: 235,
        borderRadius: 10,
        marginHorizontal: 'auto'
    },

    image: {
        width: '100%',
        height: 235,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#424242'
    },

    font: {
        fontFamily: 'Space Grotesk'
    },

    text: {
        textAlign: 'center',
        margin: 10
    }
});