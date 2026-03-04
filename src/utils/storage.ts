import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types';

const STORAGE_KEY = 'todos';

export const loadTodos = async (): Promise<Todo[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data && data.length > 0) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load todos:', e);
  }
  return [];
};

export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos:', e);
  }
};
