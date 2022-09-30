import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Button, 
  ScrollView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  SafeAreaView } from "react-native";
import Header from './src/components/Header';
import { Notes } from './src/types/index';
import { updateAsyncStorage } from './src/utils/updateAsyncStorage';
import { loadFromAsyncStorange } from './src/utils/loadFromAsyncStorange';


interface Props {}

const App: React.FC<Props> = () => {
  const [value, setValue] = useState<string>("");
  const [toDoList, setToDos] = useState<Notes[]>([]);
  const [error, showError] = useState<Boolean>(false);

  // read the local storage and fill the state
  const readStorage = async() => {
    const data = await loadFromAsyncStorange();
    if(data){
      setToDos(data);
    }
  }
  
  //handle submit for new taks
  const handleSubmit = async () => {
    if (value.trim()){
      setToDos([...toDoList, { text: value, completed: false }]);
      await updateAsyncStorage([...toDoList]);
    }
    else showError(true);
    setValue("");
  };

  //remove one taks
  const removeItem = async (index: number) => {
    const newToDoList = [...toDoList];
    newToDoList.splice(index, 1);
    setToDos(newToDoList);
    await updateAsyncStorage([...newToDoList]);
  };

  //complete or not the taks
  const toggleComplete = async (index: number) => {
    const newToDoList = [...toDoList];
    newToDoList[index].completed = !newToDoList[index].completed;
    setToDos(newToDoList);
    await updateAsyncStorage([...newToDoList]);
  };

  useEffect(() => {
    readStorage();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        {toDoList.map((toDo: Notes, index: number) => (
          <View key={`${index}_${toDo.text}`}>
            <Text
              style={[
                styles.note,
                { textDecorationLine: toDo.completed ? "line-through" : "none" }
              ]}
            >
              {toDo.text}
            </Text>
            <Button
              title={toDo.completed ? "Completed" : "Complete"}
              onPress={() => toggleComplete(index)}
            />
            <Button
              title="X"
              onPress={() => {
                removeItem(index);
              }}
              color="crimson"
            />
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView 
            style={styles.footer}
            behavior="position" 
            enabled={true}
        >
        <View style={styles.footerInner}>
          <TouchableOpacity 
          style={styles.btn}
          onPress={handleSubmit}
          >
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
          {error && (
            <Text style={styles.error}>Error: Input field is empty...</Text>
          )}
          <TextInput
            placeholder="Enter your todo task..."
            value={value}
            onChangeText={e => {
              setValue(e);
              showError(false);
            }}
            style={styles.textInput}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  error: {
    backgroundColor: '#cc0011',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    position: 'relative'
  },
  scrollView: {
      maxHeight: '82%',
      marginBottom: 100,
      backgroundColor: '#fff'
  },
  note: {
      margin: 20,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      backgroundColor: '#f9f9f9',
  },
  btn: {
    zIndex: 1,
    position: 'absolute',
    right: 20,
    top: -50,
    width: 100,
    height: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#674ea7'
  },
  btnText: {
      color: '#fff',
      fontSize: 40,
  },
  textInput: {
      zIndex: 0,
      flex: 1,
      padding: 20,
      fontSize: 16,
      color: '#000',
      backgroundColor: '#ddd'
  },
  footer: {
    position: 'absolute',
    width: '100%',
    height: 100,
    bottom: 0,
  },
  footerInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});

export default App;