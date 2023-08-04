import { StatusBar,Alert, View, Text, TouchableOpacity, TextInput,PermissionsAndroid } from 'react-native'
import {getFirestore,doc, getDoc, setDoc,onSnapshot, ref} from 'firebase/firestore'
import {Restart} from 'fiction-expo-restart';
import firebase from 'firebase/compat/app'
import React, {useState, useEffect, useRef} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { startReadSMS, checkIfHasSMSPermission,requestReadSMSPermission } from "@maniac-tech/react-native-expo-read-sms";
import { Shadow } from 'react-native-shadow-2';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'



var striked = false;
var count = false;
var count1=false;
const stopback = (event) =>{
    
    event.preventDefault();
    
    }

const SendCode = ({navigation, route}) => {


  
  
    
   useEffect(()=>{
    navigation.addListener('beforeRemove', stopback);
    console.log('добавлено');
   },[])
     
     
  
  const [timeover,setTimeover]=useState(false);
  const [code2, setCode]=useState('');
 ////смс константы
 const [appState, setAppState] = useState(null);
 const [hasReceiveSMSPermission, setHasReceiveSMSPermission] = useState(null);
 const [hasReadSMSPermission, setHasReadSMSPermission] = useState(null);
 const [smsPermissionState, setSmsPermissionState] = useState(null);
 const [successCallbackStatus, setSuccessCallbackStatus] = useState(null);
 const [errorCallbackStatus, setErrorCallbackStatus] = useState(null);
 const [smsValue, setSmsValue] = useState(null);
 const [smsError, setSMSError] = useState(null);
 const [done, setDone]=useState(false);

 var dial=route.params.dialog;
 var shop2 = route.params.shop;

 const db = getFirestore();
 
//  const strikeref = firebase.firestore().ref(db, 'dialogs/'+dial+'/strike');
//  strikeref.once('value').then((snapshot)=>{
//   var str = snapshot.val();
//   console.log(str);
//  })
//  onValue(strikeref, (snapshot)=>{
//   alert('f');
//   const data = snapshot.val();
//   console.log("striked "+data);
//  })

/////////////////////////////////////конец отсчета
 useEffect(()=>{
  if(timeover==true){
    navigation.removeListener('beforeRemove', stopback);
     navigation.navigate("main");
  }
 },[timeover])



 const unsub = onSnapshot(
  doc(db, "dialogs", dial), 
  { includeMetadataChanges: true }, 
  (doc) => {
    
    if(doc.data().strike!=striked&&count1==false){
      striked = doc.data().strike;
      count1=true;
      Alert.alert(
        //This is title
       "Покупатель отменил сделку",
         //This is body text
       "Возможно у вас не оказалось необходимой суммы бонуосв.",
       [
         {text: 'Понятно'},
         
       ],
       //on clicking out side, Alert will not dismiss
     );
      setTimeover(true);
    //  navigation.removeListener('beforeRemove', stopback);
    //  navigation.navigate("main");
     
  }
  });

 const callbackFn1 = async (status, sms, error) => {
  // setSmsPermissionState("Success Callback!");

   if (status === "Start Read SMS successfully") {
    // setSuccessCallbackStatus("Start Read SMS successfully");
     //setSmsValue(sms);
     // alert(sms);
   } else if (status === "success") {
    
    
     //setSuccessCallbackStatus("just success");
     //setSmsValue(sms);
     const sms1=''+sms;
     const arr = sms1.split(',');
     const from = arr[0];
     const text = arr[1];
     const kod = text.replace(/[^0-9]/g,"");
     console.log("from "+from);
     const shop3= shop2.replace(/"/g, '');
     console.log("shop= "+shop3);
     const from1=from.replace(/[^0-9+]/g,"");
     console.log("f1="+from1+' shop='+shop3);
     //alert('код: '+kod);
     //setCode(kod);
     if(from1==shop3){
     updateCode(kod);
     }
    // alert(sms);
   } else {
     //setSuccessCallbackStatus("Error in success callback");
     //setSMSError(error);
     // alert(error);
   }
 };

 const callbackFn2 = (status, sms, error) => {
   //setSmsPermissionState("Error Callback!");
   //etErrorCallbackStatus("Start Read SMS failed");
 };

 const checkPermissions = async () => {
   const customHasReceiveSMSPermission = await PermissionsAndroid.check(
     PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
   );
   const customHasReadSMSPermission = await PermissionsAndroid.check(
     PermissionsAndroid.PERMISSIONS.READ_SMS
   );

   setHasReceiveSMSPermission(customHasReceiveSMSPermission);
   setHasReadSMSPermission(customHasReadSMSPermission);
  // setAppState("Permission check complete");
 };

 useEffect(() => {
   //console.log("requestReadSMSPermission:", requestReadSMSPermission);
   //setAppState("init");
   checkPermissions();
   return () => {}
 }, []);

 useEffect(() => {
   if (hasReceiveSMSPermission && hasReadSMSPermission) {
     //alert('разрешение есть');

     startReadSMS(callbackFn1, callbackFn2);
   }else{
     const fn = async()=> {
     await requestReadSMSPermission();
     checkPermissions();
     }
     fn();
     return () => {}
   }
 }, [hasReceiveSMSPermission, hasReadSMSPermission]);

 
 
////////////////////////////////////////// Конец смс части

  const tabusers = firebase.firestore().collection('users');
  const dialogs = firebase.firestore().collection('dialogs');
  
  
  //navigation.setParams({dialog: null});
  
  const updateCode = async (code1)=>{
    
    const db = getFirestore();
    const docRef = doc(db, "dialogs", dial);
    const docSnap = await getDoc(docRef);
    const uptcode = {
      code: code1
    }
    const increment = firebase.firestore.FieldValue.increment(1);

     let docR = doc(db, "dialogs", dial);
     let docS = await getDoc(docRef);
     const shop = docSnap.data().shop;
    const uptcoupone = {
      coupon: increment,
      [shop]:{
        summ:'0'
      }
    }
    
    let uid = await AsyncStorage.getItem('uid');
    await dialogs.doc(dial).update(uptcode); 
    
    if(count==false){
    await tabusers.doc(uid).update(uptcoupone);
    
    console.log('okkk');
    
    
    count=true;
    
    
    navigation.removeListener('beforeRemove', stopback);
    const nav = ()=>{Restart()}
    Alert.alert(
      //This is title
     "Спасибо!",
       //This is body text
     "Вам начислен 1 талон.",
     [
       {text: 'Понятно', onPress:  nav},
       
     ],
     
   );
   
  }

     
  }
  return (
    
    <View style={{marginTop:-70,flex:1, backgroundColor:'#333333',paddingTop:45,paddingBottom:30,paddingLeft:20,paddingRight:20}}>
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
<View style={{flexDirection:'column', borderRadius:20, width:'100%',padding:10, paddingTop:30, justifyContent:'center'}}><Text style={{fontSize:18, textAlign:'center'}}>Ждем смс с кодом от магазина.{"\n"}</Text><Text style={{fontSize:18, textAlign:'justify'}}>Приложение автоматически считает код из смс и отправит его. {"\n"}</Text><Text>Если вы на этом этапе выйдете из приложения или разорвется соединение с интернетом, то мы не сможем доставить код из смс покупателю. Вам будет выдано предупреждение. Если у вас накопится много предупреждений, ваш аккаунт будет заблокирован.</Text>
<View style={{alignSelf:'center', marginTop:30}}>
<CountdownCircleTimer
 
          size={200}
          strokeWidth={5}
          onComplete={()=>{ setTimeover(true); Alert.alert("Увы","Покупатель не успел дойти до кассы. Возможно скоро он попробует снова.")}}
    isPlaying={true}
    duration={600}
    colors={['#e28499', '#b8a02a', '#51a056', '#73addd', ]}
    colorsTime={[150, 50, 10, 0]}
  >
    {({ remainingTime }) => <Text style={{padding:5, textAlign:'center'}}>Дайте покупателю 10 минут что бы дойти до кассы {"\n"}{Math.floor((remainingTime % 3600) / 60)}:{remainingTime % 60}</Text>}
  </CountdownCircleTimer>
  </View>
    </View>
  </Shadow>
  </View>
  )
}

export default SendCode