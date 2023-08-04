import {ActivityIndicator, View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {getFirestore,doc, getDoc, setDoc} from 'firebase/firestore'
import firebase from 'firebase/compat/app'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Shadow } from 'react-native-shadow-2';
import {LinearGradient} from 'expo-linear-gradient';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const Ready = ({navigation}) => {
  const[wait,setWait]= useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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
      token = (await Notifications.getExpoPushTokenAsync()).data;
      
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



    ////////////////////////
    useEffect(() => {
        const asyncfn = async ()=>{
            // 
            const dial = await AsyncStorage.getItem('dial');
            const shop = await AsyncStorage.getItem('shop');
            
        }
        asyncfn();
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
          //alert(notification && JSON.stringify(notification.request.content.data.dialid1));

        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

      ///////////////////
      const dialogs = firebase.firestore().collection('dialogs');

// const checkbusy = async ()=>{
    
//     let dial = notification && JSON.stringify(notification.request.content.data.dialid1);
//     ///dial = dial.replace(/['"]+/g, '');
//     alert(dial);
//     const db = getFirestore();
//     const docRef = doc(db, "dialogs", dial);
//     const docSnap = await getDoc(docRef);
//      alert("Занято "+docSnap.data().busy);
//       const busy = docSnap.data().busy
// }
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
<View style={{flexDirection:'column', borderRadius:20, width:'100%',padding:10}}>
      <Text style={{fontSize:17, textAlign:'center'}}>Вы готовы принять код от магазина? {"\n\n"}Убедитесь что у вас стабильное соединение с интернетом и мобильной сетью.{"\n\n"}Приложение в автоматическом режиме прочитает код из смс от магазина.</Text>
      <Shadow
        distance={40}
        
        //offset={(20 || 20)}
        //#a3a3a3
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:60,width:200, alignSelf:'center'}}
        >
       
        <LinearGradient colors={['#acbbdb','#bec6d7','#c5c8c8']} style={{borderRadius:15, height:100,}}>  
      <TouchableOpacity 
      onPress={async ()=>{
           setWait(true);
           let dial = await AsyncStorage.getItem('dial');
           let shop2 = await AsyncStorage.getItem('shop');
           dial = dial.replace(/['"]+/g, '');
           
           await AsyncStorage.removeItem('dial');
           //alert("dial ready "+dial);
           const db = getFirestore();
           const docRef = doc(db, "dialogs", dial);
           const docSnap = await getDoc(docRef);
           const busy = await docSnap.data().busy;
           let phoneNumber = await AsyncStorage.getItem('phone');
           if(busy!='1'){
            let uptbusy = {busy:"1", phone:phoneNumber}
            await dialogs.doc(dial).update(uptbusy);
            navigation.navigate('sendCode', {dialog: dial, shop: shop2});
            setWait(false);
        }else{
                Alert.alert("Вы опоздали. Другой пользователь вас опередил, либо покупатель передумал.");
                navigation.navigate("main");
            }
      }}
      style={{padding:20, margin:20, borderRadius:15 }}>{wait?(<><ActivityIndicator size="small" color="#000000" /></>):(<><Text style={{textAlign:'center', color:'white', fontSize:20,height:100}}>Готов</Text></>)}
      </TouchableOpacity>
      </LinearGradient>
      </Shadow>
</View>
</Shadow>
    </View>
  )
}

export default Ready