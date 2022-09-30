import { AsyncStorage } from "react-native";
import { Notes } from '../types/index';

//Load data from local storage

export const loadFromAsyncStorange = async(): Promise<Notes[]> => {
    const notes = await AsyncStorage.getItem('notes');
    if (notes && notes.length > 0) {
        return JSON.parse(notes)
    }
    return [];
}