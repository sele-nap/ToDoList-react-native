import { AsyncStorage } from "react-native";
import { Notes } from '../types/index';

//Send data to local storage

export const updateAsyncStorage = (notes: Notes[]) => {

    return new Promise( async(resolve, reject) => {

        try {

            await AsyncStorage.removeItem('notes');
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
            return resolve(true);

        } catch(e) {
            return reject(e);
        }

    });

}