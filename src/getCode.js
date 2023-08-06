import { StatusBar,Alert, View, Text, FlatList, Pressable, Image, Modal, TextInput, Button, TouchableOpacity, LogBox} from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { firebaseConfig } from '../config'
import firebase from 'firebase/compat/app'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore,doc, getDoc, getDocs,setDoc, onSnapshot, where, query, collection} from 'firebase/firestore'
import { AntDesign } from '@expo/vector-icons'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {LinearGradient} from 'expo-linear-gradient';
import { mask } from "react-native-mask-text";
import {Restart} from 'fiction-expo-restart';
import { Shadow } from 'react-native-shadow-2';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const dialogs = firebase.firestore().collection('dialogs');
const stopback = (event) =>{
  
  event.preventDefault();
  
  }

const GetCode = ({navigation, route}) => {
const [dis2,setDis2]=useState(false);
const [mod,setMod] = useState(false);
const [dis, setDis]=useState(true);
const [bcolor, setBcolor] = useState("grey");



useEffect(()=>{

navigation.addListener('beforeRemove', stopback);
  console.log('добавлено');

},[])
  
  

  
  const tabusers = firebase.firestore().collection('users');
  const[count, setCount]= useState(0);
    const [code, setCode] = useState('');
    const [phone, setPhone]= useState('');
    var dial = route.params.dialog;
    if(route.params.promo){
    var promo = route.params.promo;}
    //navigation.setParams({dialog: null});
    const db = getFirestore();
    
    //устанавливаем телефон
    useEffect(()=>{
      const asfn = async()=>{
        //let uid = await AsyncStorage.getItem('uid');
        const docRef = doc(db, "dialogs", dial);
        const docSnap = await getDoc(docRef);
      console.log(docSnap.data().phone);
        const phone = docSnap.data().phone;
        setPhone(phone);}
        asfn();
    },[])
    
    //ждем код
    useEffect(()=>{
      const unsub = onSnapshot(
        doc(db, "dialogs", dial), 
        { includeMetadataChanges: false }, 
        async(doc) => {
          if (code!=doc.data().code){
          setCode(doc.data().code);
        
          
            
          const decrement = firebase.firestore.FieldValue.increment(-1);
          const increment = firebase.firestore.FieldValue.increment(1);
          
            const uptcoupone1 = {
              
              used:true
            }
            const uptcouponepromo={
              coupon:increment
            }
          const uptcoupone = {
            coupon: decrement
            }
          
          
          let uid = await AsyncStorage.getItem('uid');
          if(count==0){
            console.log(count); 
            if(promo){
              console.log("promo!");
          await tabusers.doc(uid).update(uptcoupone1);
          await tabusers.doc(promo).update(uptcouponepromo);
        }else{await tabusers.doc(uid).update(uptcoupone);}
          navigation.setParams({dialog: null});
          dial='';
          setDis2(true);
          setDis(false);
          setBcolor("white");
          
          navigation.removeListener('beforeRemove', stopback);
          console.log('удалено');
          }
        }
          
        });
    },[])
    
     const strike = async ()=>{
      let uptbusy = {strike:true}
      await dialogs.doc(route.params.dialog).update(uptbusy);
          const user = query(collection(db, "users"),where("phone","==", phone));
         // console.log(getDocs(user));
          const increment = firebase.firestore.FieldValue.increment(1);
          const uptstrike = {
            strike: increment
          }
          tabusers.where("phone", "==", phone)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                  console.log(doc.id, " => ", doc.data());
                  doc.ref.update(uptstrike)//not doc.update({foo: "bar"})
              });
         })
          
        }
          
        
     

  return (
    <View style={{marginTop:-70,flex:1, backgroundColor:'#333333',paddingTop:45,paddingBottom:30,paddingLeft:20,paddingRight:20}}>
      <Modal
      visible={mod}
      animationType="fade">
       <View  style={{padding:'10%', alignItems:'center',paddingTop:'10%', backgroundColor:'#b8b8b8', height:'100%'}}>
       <Text style={{fontSize:15}}>1. Проверьте что вы указали нужный номер телефона.{"\n"}
       2. Если на этом номере бонусы есть, но меньше чем вы искали, то вы можете:{"\n"}{"\n"}
       ➠ Продолжить покупку, используя те бонусы, которые есть на этом номере. С вас спишется талон.{"\n"}{"\n"}
       ➠ Или отказаться от покупки. С вас не спишется талон, а продавцу будет выдано предупреждение.
       </Text>
       <Shadow
        distance={40}
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde",width:200, alignSelf:'center'}}
        >
        {/* КУПИТЬ */}
        <LinearGradient colors={['#acbbdb','#bec6d7','#c5c8c8']} style={{borderRadius:15, height:100, justifyContent:'center'}}>  
      
        <TouchableOpacity 
      
         style={{padding:10, borderRadius:15}}
         onPress={()=>{setMod(false)}}
         >
          <Text style={{fontSize:18, color:'#3c3c3c',textAlign:'center'}}>Продолжить покупку</Text>
          </TouchableOpacity>
          </LinearGradient>
          </Shadow>

          <Shadow
        distance={40}
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde", width:200, alignSelf:'center'}}
        >
        {/* КУПИТЬ */}
        <LinearGradient colors={['#dbacac','#d7bebe','#c5c8c8']} style={{borderRadius:15, height:100,justifyContent: 'center',}}>  
      
        <TouchableOpacity 
        
         style={{padding:10,   borderRadius:15}}
         onPress={()=>{navigation.removeListener('beforeRemove', stopback); navigation.navigate("main");strike(); setMod(false);}}
         >
          <Text style={{fontSize:18, color:'#3c3c3c',textAlign:'center'}}>отказаться от покупки</Text>
          </TouchableOpacity>
          </LinearGradient>
          </Shadow>
       </View>

      </Modal>
      <StatusBar
      translucent = {true}
      backgroundColor="#88888800"
      //hidden={true}
      //showHideTransition={true}
      />
      <Shadow 

//paintInside={true}
 distance={60}
 //style={{alignSelf: 'stretch'}}
 startColor='#888888'
 endColor='#333333'
 
 //borderRadius={20}
 style={{borderRadius:20,height:'100%', paddingTop:5,width:'100%'}}
 containerStyle={{marginTop:30,backgroundColor:'#b8b8b8', width:'100%', borderRadius:20}}
>
<View style={{flexDirection:'column', borderRadius:20, width:'100%',padding:10}}>

      <Text style={{textAlign:'center'}}>У вас есть 10 минут. Назовите на кассе этот телефон:</Text>
      <Shadow
        distance={8}
        //style={{alignSelf: 'stretch'}}
        startColor='#c6d1d6'
        finalColor='#cecece'
        style={{borderRadius:15,width:'100%'}}
        containerStyle={{borderRadius:15, backgroundColor:"white", marginTop:10}}
        
        >
      <Text style={{borderWidth:1, borderColor:"#bbb", fontSize:18, padding:10, borderRadius:15, textAlign:"center"}}>{mask(phone, "+7(999)999-9999")}</Text>
      </Shadow>
      <Text style={{marginTop:20, textAlign:'center'}}>В этом окне появится нужный код:</Text>
      <Shadow
        distance={8}
        //style={{alignSelf: 'stretch'}}
        startColor='#c6d1d6'
        finalColor='#cecece'
        style={{borderRadius:15,width:'100%'}}
        containerStyle={{borderRadius:15, backgroundColor:"white", marginTop:10}}
        
        >
      <Text
        style={{fontSize:20, borderWidth:0.5, borderColor:"#bbb", padding:10, borderRadius:15, textAlign:"center"}}
        >
            {code}
        </Text>
        </Shadow>
        <Shadow
        distance={40}
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde",width:200, alignSelf:'center'}}
        >
        {/* КУПИТЬ */}
        <LinearGradient colors={['#acbbdb','#bec6d7','#c5c8c8']} style={{borderRadius:15, height:100, justifyContent:'center'}}>  
      
        <TouchableOpacity 
        disabled={dis}
         style={{padding:10, borderRadius:15}}
         onPress={()=>{Restart()}}
         >
          <Text style={{fontSize:18, color:bcolor,textAlign:'center'}}>Все хорошо.</Text>
          </TouchableOpacity>
          </LinearGradient>
          </Shadow>

          <Shadow
        distance={40}
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde", width:200, alignSelf:'center'}}
        >
        {/* КУПИТЬ */}
        <LinearGradient colors={['#dbacac','#d7bebe','#c5c8c8']} style={{borderRadius:15, height:100,justifyContent: 'center',}}>  
      
        <TouchableOpacity 
        disabled={dis2}
         style={{paddingTop:0,   borderRadius:15}}
         onPress={()=>{setMod(true)}}
         >
          <Text style={{fontSize:18, color:'#3c3c3c',textAlign:'center'}}>на этом номере нет заявленной суммы бонусов или код не пришел?</Text>
          </TouchableOpacity>
          </LinearGradient>
          </Shadow>

          
          </View>
          </Shadow>

          
          
    </View>
  )
}

export default GetCode