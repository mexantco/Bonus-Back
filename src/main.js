import { ActivityIndicator, AppState, View,Linking, Text, Modal, TouchableOpacity, Alert,PermissionsAndroid, LogBox,StatusBar } from 'react-native'
import React, { useEffect, useState, useRef, useReducer} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { firebaseConfig } from '../config'
import firebase from 'firebase/compat/app'
import { AntDesign } from '@expo/vector-icons'
import {getFirestore,doc, getDoc} from 'firebase/firestore'
import * as Notifications from 'expo-notifications';
import { Shadow } from 'react-native-shadow-2';
import {LinearGradient} from 'expo-linear-gradient';
import { startReadSMS, checkIfHasSMSPermission,requestReadSMSPermission } from "@maniac-tech/react-native-expo-read-sms";
import * as SplashScreen from 'expo-splash-screen';
import { setStatusBarHidden } from 'expo-status-bar';
import { MaskedTextInput } from "react-native-mask-text";
var count=0;
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

function cifra(number){
  number = Math.abs(number);
  let last = number.toString().split('').pop();
  switch (true) { 
      case number==11||number==111||number==112||number==113||number==114||number==211||number==311||number==411||number==511||number==611||number==711: return 'талонов'; break;
      case last==1: return 'талон'; break;
      case last==2||last==3||last==4: return 'талона'; break;
      default: return 'талонов'; break;
  }
}

const Main =  ({navigation}) => {
  
  navigation.addListener('beforeRemove',(e)=>{
    e.preventDefault();
  })
  ////смс константы
  const [mod3,setMod3] = useState(false);
  const [mod2,setMod2]= useState(0);
  const [appState, setAppState] = useState(null);
  const [hasReceiveSMSPermission, setHasReceiveSMSPermission] = useState(null);
  const [hasReadSMSPermission, setHasReadSMSPermission] = useState(null);
  const [smsPermissionState, setSmsPermissionState] = useState(null);
  const [successCallbackStatus, setSuccessCallbackStatus] = useState(null);
  const [errorCallbackStatus, setErrorCallbackStatus] = useState(null);
  const [smsValue, setSmsValue] = useState(null);
  const [smsError, setSMSError] = useState(null);
  const [grbuy,setBuy]=useState(['#acbbdb','#bec6d7','#c5c8c8']);
  
  const[grsell,setSell]=useState(['#c5c8c8','#c9c9bb', '#cdcd9e']);
  const [grinfo,setInfo]=useState(['#c5c8c8','#bbc9c4', '#9ecdc4']);

  

  const checkPermissions = async () => {
    const customHasReceiveSMSPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
    );
    const customHasReadSMSPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS
    );

    setHasReceiveSMSPermission(customHasReceiveSMSPermission);
    setHasReadSMSPermission(customHasReadSMSPermission);
    //setAppState("Permission check complete");
  };
  AppState.addEventListener('change', nextAppState => {checkPermissions()})
  useEffect(() => {
    requestReadSMSPermission().then(()=>{checkPermissions();});
    console.log("requestReadSMSPermission:", requestReadSMSPermission);
    //setAppState("init");
    
    
    return () => {}
  }, []);

  useEffect(() => {
    
    if (hasReceiveSMSPermission && hasReadSMSPermission) {
      
      setMod2(false);
      
      }else{   
        if(count!=0){setMod2(true);}
        count+=1;
        //alert('no');
    //   const fn = async()=> {
        
    //   await requestReadSMSPermission();
    //  await checkPermissions();
    //   if (hasReceiveSMSPermission && hasReadSMSPermission){setMod2(false)}else{setMod2(true)}
      
      
    //   }
    //   fn();
    }
    return () => {}
  }, [hasReceiveSMSPermission, hasReadSMSPermission]);

  
  
////////////////////////////////////////// Конец смс части
  
  //проверка на пуш
  const checkdial = async ()=>{
    if (await AsyncStorage.getItem('dial')){navigation.navigate('ready')}
  }
  checkdial();
///

  const responseListener = useRef();
  useEffect(()=>{
    //registerForPushNotificationsAsync();
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        
      })
      return () => {}
  })

  const [strike,setStrike]= useState(false);
  const [users, setUsers]= useState([]);
  const [coupon, setCoupon]= useState(null);
  const [used, setUsed]= useState(false);
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const [dis,setDis]= useState(true);
 

  
// const clear = async ()=>{
  
//   await AsyncStorage.removeItem('uid');
// }

const tabusers = firebase.firestore().collection('users');
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({projectId: "7546fd6d-4af6-4e6e-af73-58b6e5577778"})).data;
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
  
  useEffect( ()=>{
    const asyncfn = async ()=>{
    // 
    const uid = await AsyncStorage.getItem('uid');
    
    //alert(uid);
    const db = getFirestore();
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
     console.log(docSnap.data().used);
      const strike = docSnap.data().strike;
      if(strike>=5){setStrike(true);}
      
      const coupon = docSnap.data().coupon;
      const used2 = docSnap.data().used;
      setCoupon(coupon);
      setUsed(used2);
      setDis(false);
      console.log(error)
  
  }
  const rerender = navigation.addListener('focus', () => {
    
    //forceUpdate()
   asyncfn();

  });
  asyncfn();
  registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      

    });
    

  responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
    console.log(response);
    navigation.navigate('ready');
    let dial = await JSON.stringify(response.notification.request.content.data.dialid1);
    //alert("dial main  "+dial);
    await AsyncStorage.setItem('dial', dial);
  });
  return () => {}
    
  }, [])
  const increment = firebase.firestore.FieldValue.increment(1);
  // const uid = AsyncStorage.getItem('uid');
  // console.log(uid);
  
    //if(!AsyncStorage.getItem('uid')){ navigation.navigate('index')}
  return (
    
    <View style={{marginTop:-70,flex:1,  backgroundColor:'#333333',paddingTop:45,paddingBottom:30,paddingLeft:20,paddingRight:20}}>
      <Modal 
      visible={mod2}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ padding:20,alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}><Text  style={{fontSize:25}}></Text>
        <Text style={{fontSize:20, textAlign:'center', marginBottom:20}}>Для корректной работы приложения, нам необходимо разрешение принимать смс. Это нужно для того, что бы приложение в автоматическом режиме считывало код от магазина и направляло его покупателю.
                        Таким образом мы избежим ошибок и неприятных ситуаций. </Text>
            <Shadow
            distance={15}
            //style={{alignSelf: 'stretch'}}
            startColor='#bfc1c2'
            finalColor='#cecece'
            style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'#b3b3b361', width:'100%'}}
        containerStyle={{   borderRadius:15, backgroundColor:"#d6dcde", marginBottom:20, height:80, width:'80%',}}
        
            >
                <LinearGradient colors={['#bbc5da','#bec6d7','#c5c8c8']} style={{borderRadius:15, width:'100%', height:'100%'}}>
                <TouchableOpacity style={{borderRadius:15,flex:1, justifyContent:'center', display:'flex'}} onPress={()=>{Linking.openSettings()}}>
                    <Text style={{fontSize:20, textAlign:'center'}}>
                        открыть настройки
                    </Text>

                </TouchableOpacity>
                </LinearGradient>
            </Shadow> 
        </View>
        </Modal>

        <Modal 
      visible={mod3}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ padding:20,alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}><Text  style={{fontSize:25}}></Text>
        <AntDesign style={{marginBottom:30}} name="closecircle" size={40} color="#aaaaaa" onPress={()=>{setMod3(false)}} />
        <Text style={{fontSize:20, textAlign:'center', marginBottom:20}}>Введите промо код.</Text>
        <Shadow
            distance={8}
            //style={{alignSelf: 'stretch'}}
            startColor='#c6d1d6'
            finalColor='#cecece'
            style={{borderRadius:15,width:'50%',height:80, padding:0,alignSelf:'center'}}
            containerStyle={styles.input}
            
            >
            <MaskedTextInput
            inputMode='tel'
            placeholder='введите код'
            //keyboardType='numeric'
            style={{backgroundColor:'white', fontSize:20, width:'100%', height:'100%', borderRadius:20, textAlign:'center'}}
            onChangeText={async(text) => {
              const uptcoup = {
                coupon: increment
              }
                //setPinuser(text);
                if(text.length==8){
                  tabusers.where("promo", "==", text)
          .get()
          .then(function(querySnapshot) {
            // let count= 0;
            if(querySnapshot.size!='0'){querySnapshot.forEach(function(doc) {
               //console.log(doc.id, " => ", doc.data());
               let uid= doc.id;
               navigation.navigate("buy", {promoid:uid})
               setMod3(false);
              //doc.ref.update(uptcoup)//not doc.update({foo: "bar"})
              
          });}else{alert("не верный промокод")}
             
          // if(count!=0){alert("промо код есть")}else{alert("не верный промокод")}
          }).catch(()=>{
              // console.log("не верно");
          })
                  //alert("код введен")
                }
                

            

    // +1 (123) 456-78-90
   // console.log(extracted) // 1234567890
             }}
             mask="SSSSSSSS"
            /></Shadow>
        </View>
        </Modal>        

        <Modal 
      visible={strike}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ padding:20,alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}><Text  style={{fontSize:25}}></Text>
        <Text style={{fontSize:20, textAlign:'center', marginBottom:20}}>Ваш номер телефона заблокирован в нашем сервисе.{"\n"} Нас вас поступило много жалоб. Приобретите талон, чтобы разблокировать профиль. </Text>
            <Shadow
            distance={15}
            //style={{alignSelf: 'stretch'}}
            startColor='#bfc1c2'
            finalColor='#cecece'
            style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'#b3b3b361', width:'100%'}}
        containerStyle={{   borderRadius:15, backgroundColor:"#d6dcde", marginBottom:20, height:80, width:'80%',}}
        
            >
                <LinearGradient colors={['#bbc5da','#bec6d7','#c5c8c8']} style={{borderRadius:15, width:'100%', height:'100%'}}>
                <TouchableOpacity style={{borderRadius:15,flex:1, justifyContent:'center', display:'flex'}} onPress={()=>{navigation.navigate("pay");}}>
                    <Text style={{fontSize:20, textAlign:'center'}}>
                        оплатить
                    </Text>

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
       style={{borderRadius:20,height:'100%', width:'100%', paddingTop:15}}
       containerStyle={{marginTop:30,backgroundColor:'#b8b8b8', width:'100%', borderRadius:20}}
      >

      <View style={{alignSelf:'center',flexDirection:'row',backgroundColor:'#9f9f9f', height:40, borderRadius:20, width:'90%'}}>
      <Shadow
        
        distance={8}
        //style={{alignSelf: 'stretch'}}
        startColor='#c6d1d6'
        finalColor='#cecece'
        style={{borderRadius:20,width:'100%',height:40}}
        containerStyle={{  flex:1, borderRadius:20,  backgroundColor:"#d6dcde"}}
        >
          <View style={{height:'100%', justifyContent:'center'}}>
        <Text style={{fontSize:20, fontWeight:'500',color:'#404040', textAlign:'center'}}>{coupon!=null? (coupon):(<><ActivityIndicator size={15} color="#000000" /></>) }</Text>
        </View>
        </Shadow>
        <View style={{flex:2, width:'100%', justifyContent:'center'}}><Text style={{textAlign:'center'}}>{cifra(coupon)}</Text></View>
        <Shadow
        
        distance={8}
        //style={{alignSelf: 'stretch'}}
        startColor='#c6d1d6'
        finalColor='#cecece'
        style={{borderRadius:20,width:'100%',height:40}}
        containerStyle={{  flex:4, borderRadius:15, backgroundColor:"#d6dcde"}}
        >
        <TouchableOpacity title="Пополнить" style={{height:'100%', justifyContent:'center'}} onPress={async()=>{let uid =await AsyncStorage.getItem('uid'); navigation.navigate("pay", {uid:uid});}}>
             <Text style={{fontSize:17, color:'#404040',textAlign:'center'}} >Пополнить</Text>
        </TouchableOpacity>
        </Shadow>
        {/* <TouchableOpacity onPress={clear} title="очистить" style={{width:'100%', flex:1, padding:5, marginTop:100, borderRadius:15, backgroundColor:"#68a0cf"}}>
             <Text style={{fontSize:18, color:'white',textAlign:'center'}} >Очистить</Text>
        </TouchableOpacity> */}
      </View>

      {/* ПРОДАТЬ */}
      
      <View style={{flexDirection:'column', height:'80%', alignItems:'center', paddingTop:40 }}>
        <Shadow
        distance={40}
        
        //offset={(20 || 20)}
        //#a3a3a3
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'white'}}
        containerStyle={{  flex:2, borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:60,width:'60%'}}
        >
        {/* КУПИТЬ */}
        <LinearGradient colors={grbuy} style={{borderRadius:15}}  >  
      <TouchableOpacity onPressOut={()=>{setBuy(['#acbbdb','#bec6d7','#c5c8c8'])}} onPressIn={()=>{setBuy(['#c5c8c8','#bec6d7','#acbbdb'])}} onPress={()=>navigation.navigate("sell")} style={{width:'100%', textAlign:'center'}}>
             <Text style={{fontSize:20, width:200, color:'white',textAlign:'center', height:'100%',textAlignVertical:'center',}} >продать</Text>
        </TouchableOpacity>
        </LinearGradient>
        </Shadow>
        <Shadow
        distance={40}
        //#bfc1c2
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'white'}}
        containerStyle={{  flex:2, borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:60, width:'60%'}}
        //offset={[8,15]}
        >
          <LinearGradient colors={grsell} style={{borderRadius:15}}>  
        <TouchableOpacity  disabled={dis} onPressOut={()=>{setSell(['#c5c8c8','#c9c9bb', '#cdcd9e'])}} onPressIn={()=>{setSell(['#cdcd9e','#c9c9bb','#c5c8c8' ])}} onPress={()=>{
          console.log(used);
          if(coupon!='0'){navigation.navigate("buy", {promoid:null} )}
          else if(used==false){Alert.alert("У вас недостаточно талонов для покупки.","У вас есть промокод?", [{text: 'У меня есть промо код', onPress:  ()=>{setMod3(true)}},{text: 'Нету', onPress:  ()=>{}}] )}
          else{Alert.alert("У вас недостаточно талонов для покупки.")}}} 
          style={{width:'100%', textAlign:'center'}}>
             <Text style={{fontSize:20, width:200,color:'white',textAlign:'center', textAlignVertical:'center', height:'100%'}} >купить</Text>
        </TouchableOpacity>
        </LinearGradient>
        </Shadow>
        <Shadow
        distance={40}
        //#bfc1c2
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'white'}}
        containerStyle={{  flex:1, borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:10, flex:1,width:'60%'}}
        //offset={[8,15]}
        >
          <LinearGradient colors={grinfo} style={{borderRadius:15}}>  
        <TouchableOpacity  disabled={dis} onPressOut={()=>{setInfo(['#c5c8c8','#bbc9c4', '#9ecdc4'])}} onPressIn={()=>{setInfo(['#9ecdc4','#bbc9c4','#c5c8c8' ])}} onPress={()=>{navigation.navigate("info")}} style={{width:'100%', textAlign:'center'}}>
             <Text style={{fontSize:20, width:200,color:'white',textAlign:'center', textAlignVertical:'center', height:'100%'}} >как это работает?</Text>
        </TouchableOpacity>
        </LinearGradient>
        </Shadow>
      </View>
      
      </Shadow>
    </View>
  )
}

export default Main
const styles={
  button:{
     height:80,
     marginBottom:20,
 alignItems:'center',
 width:'100%',
 textAlign:'center',
 borderRadius:20,
 backgroundColor:'#bbb',
 padding: 20,
 fontSize:1
     },
 input:{
     marginBottom:20,
         borderRadius:20,
         width:'100%',
          }
 }