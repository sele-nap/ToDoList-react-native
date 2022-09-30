import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {}

const Header: React.FC<Props> = () => {

    return (
        <View style={styles.header}>
            <Text style={styles.text}>ToDo List</Text>
        </View>
    );

}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '18%',
        borderBottomWidth: 8,
        borderBottomColor: "#ddd",
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#674ea7'
    },
    text: {
        fontSize: 18,
        letterSpacing: 1.1,
        fontWeight: 'bold',
        color: '#fff'
    }
});
export default Header;