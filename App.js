import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { app } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';

export default function App() {

  const database = getDatabase(app);
  const [grocery, setGrocery] = useState({
    product: '',
    amount: ''
  });
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItems(Object.values(data));
      } else {
        setItems([]); // Handle the case when there are no items
      }

    })
  }, []);

  const handleSave = () => {
    if (grocery.product && grocery.amount) {
      push(ref(database, 'items/'), grocery);
    }
    else {
      Alert.alert('Error', 'Type product and amount first');
    }
  }

  const deleteItem = (item) => {
    remove(ref(database, `items/`), item);
    console.log(item)
  }

  return (  
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Product' 
        onChangeText={text => setGrocery({...grocery, product: text})}
        value={grocery.product}/>  
      <TextInput 
        style={styles.input}
        placeholder='Amount' 
        onChangeText={text => setGrocery({...grocery, amount: text})}
        value={grocery.amount}/>
      <View style={styles.buttons}> 
        <Button onPress={handleSave} title="Save" />
      </View>
      <View style= {styles.list}>
        <Text style= {styles.header}>Shopping list</Text>
        <FlatList 
          renderItem={({item}) => 
            <View>
              <Text>{item.product}, {item.amount}
                <Text style={{ color: '#0000ff' }} 
                  onPress={() => deleteItem(item)}>   Delete
                </Text>
              </Text>
            </View>} 
          data={items} />
      </View>   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    paddingTop: 5,
    paddingBottom: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  list: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 200, 
    height: 30,
    textDecorationLine: 'underline',
    borderColor: 'gray', 
    borderWidth: 1,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10
  }
});
