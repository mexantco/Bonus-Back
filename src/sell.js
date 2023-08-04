import {Dimensions, StatusBar,Alert, View, Text, FlatList, Pressable, Image, Modal, TextInput, Button, TouchableOpacity, LogBox} from 'react-native'
import React, {useState, useEffect} from 'react'
import { firebaseConfig } from '../config'
import firebase from 'firebase/compat/app'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { doc, setDoc } from "firebase/firestore"
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Shadow } from 'react-native-shadow-2';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
const tabusers = firebase.firestore().collection('users');
// Add a new document in collection "cities"


const Sell = () => {

//BackHandler.addEventListener('hardwareBackPress', function () {return false})
  ////////////
  const [changedate, setChange] = useState(0);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setChange(1);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  ////
  const [amount2, setAmount2] = useState('0');
  const [mod, setMod] = useState(false);
  const [modname, setModname] = useState('');
  const updatesell = async (namesell, amount, date1)=>{
    
    if(changedate==1&&amount2!='0'){
    const uid2 = await AsyncStorage.getItem('uid');
    const updtdata = {
      [namesell]:{
        summ:amount,
        dateex: date1
      }
    }
    await tabusers.doc(uid2).update(updtdata);

    Alert.alert("Готово!", "Вам придет уведомление, когда ваши бонусы захотят купить.");
    setMod(false);
    setAmount2('');
    }else if(amount2=='0'){Alert.alert("Бонусов должно быть больше чем 0")}else{
      Alert.alert("Сначала выберите дату окончания действия бонусов")
    }
  }
   
  
  const [sellarr, setSellarr] = useState([]);
  const sellitem = firebase.firestore().collection('sellitem');
  const [amount, setAmount] = useState('0');
  useEffect( ()=>{
    const fn = async()=>{sellitem
    .onSnapshot(querySnapshot=>{
      const sellarr = [];
      querySnapshot.forEach((doc)=>{
        const {name, img} = doc.data();
        sellarr.push({
          id: doc.id,
          name,
          img,
        })
      });
      setSellarr(sellarr);
      
    });}
    fn();
  
    return () => {}
  }, [])
  
  return (
    <View style={{marginTop:-70,flex:1, backgroundColor:'#333333',paddingTop:45,paddingBottom:30,paddingLeft:20,paddingRight:20}}>
      <StatusBar
      translucent = {true}
      backgroundColor="#88888800"
      //hidden={true}
      //showHideTransition={true}
      />

      <Modal 
      visible={mod}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{minHeight: Math.round(Dimensions.get('window').height), padding:'15%', alignItems:'center',paddingTop:'30%', backgroundColor:'#cecece', height:'100%'}}>
        <AntDesign style={{marginBottom:30}} name="closecircle" size={40} color="#bbb" onPress={()=>{setMod(false)}} />
        <Text style={{marginBottom:15, fontSize:20}}>Сколько у вас бонусов в {modname}:</Text>
        <Shadow
        distance={8}
        //style={{alignSelf: 'stretch'}}
        startColor='#c6d1d6'
        finalColor='#cecece'
        style={{borderRadius:15,width:'100%',height:80}}
        containerStyle={{height:80, borderRadius:15, backgroundColor:"white", marginTop:10}}
         >
        <TextInput onFocus={()=>{setAmount2('')}} style={{width:'50%', marginBottom:15, borderRadius:15, padding:15, fontSize:20, height:'100%'}} value={amount2} keyboardType='number-pad' name="summinp" placeholder='бонусы' onChangeText={setAmount2}/>
        </Shadow>
       <Shadow
       distance={8}
       //style={{alignSelf: 'stretch'}}
       startColor='#c6d1d6'
       finalColor='#cecece'
       style={{borderRadius:15,width:'100%',height:40}}
       containerStyle={{height:40, borderRadius:15, backgroundColor:"#d6dcde", marginTop:10}}
        >
        <TouchableOpacity style={{backgroundColor:"white", borderRadius:15, height:40,justifyContent:'center', padding:5}} onPress={showDatepicker} ><Text>Выбирете дату окончания действия</Text></TouchableOpacity>
        </Shadow>
        {show && (
        <DateTimePicker
        minimumDate={new Date()}
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
       <Shadow
       distance={40}
       //style={{alignSelf: 'stretch'}}
       startColor='#c0cbcf'
       finalColor='#cecece'
       style={{borderRadius:20, width:'100%', height:'100%'}}
       containerStyle={{ marginTop:30,  flex:1, borderRadius:15, backgroundColor:"#d6dcde", width:'100%', justifyContent:'center'}}
       
       >
       <TouchableOpacity style={{ borderRadius:15, flex:1, justifyContent:'center', display:'flex'}} onPress={()=>{updatesell(modname, amount2, date); }}>
            <Text style={{textAlignVertical:'center', textAlign:'center', color:'black', flex:1,fontSize:20}}>Сохранить</Text>
          </TouchableOpacity>
          </Shadow>
          <Text style={{marginBottom:20, textAlign:'center'}}>Бонусы должны числится на номере, указанном при регистрации.</Text>

        </View>
        
      </Modal>
      <Shadow
      distance={60}
      //style={{alignSelf: 'stretch'}}
      startColor='#888888'
      endColor='#333333'
      
      //borderRadius={20}
      style={{borderRadius:20,height:'100%',width:'100%', paddingTop:5}}
      containerStyle={{marginTop:30,backgroundColor:'#cecece', width:'100%', borderRadius:20, padding:10}}
      >
      <FlatList 
      style={{height:'100%'}}
      data={sellarr}
      numColumns={1}
      renderItem={({item})=>(
        <Pressable onPress={()=>{
          setMod(true);
          setModname(item.name);
          
          //
          }}>
          <View >
             <Text style={{padding:10, fontSize:20, textAlign:'center'}}>{item.name}</Text>
             <Image 
             
             style={{
              
              height: 220,
              margin: 6,
            }}
             source={{uri: item.img}}
             
             />
          </View>
        </Pressable>
      )}
      />
      </Shadow>
    </View>
  )
}

export default Sell