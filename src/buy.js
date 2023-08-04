import {Dimensions, ActivityIndicator,StatusBar, Alert, View, Text, FlatList, Pressable, Image, Modal, TextInput, Button, TouchableOpacity, LogBox } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { firebaseConfig } from '../config'
import firebase from 'firebase/compat/app'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {getFirestore,doc, getDoc, setDoc, onSnapshot} from 'firebase/firestore'
import { AntDesign } from '@expo/vector-icons'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Shadow } from 'react-native-shadow-2';
import {LinearGradient} from 'expo-linear-gradient';
import CountDown from 'react-native-countdown-component-gen-fixed';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'



LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


/////
const tabusers = firebase.firestore().collection('users');
const dialogs = firebase.firestore().collection('dialogs');
// Add a new document in collection "cities"
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
      //alert('Failed to get push token for push notification!');
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

var promoid=null;

const Buy = ({navigation, route}) => {
  
  
  promoid = route.params.promoid;
  const [modname, setModname] = useState('');
  const [mod, setMod] = useState(false);
  const [mod3, setMod3] = useState(false);

 /////функция отправки пуша
async function sendPushNotification(expoPushToken, dial ) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Мне нужны',
    body: 'бонусы в '+modname,
    data: { dialid1: dial, shop: modname },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

  /////
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [busy, setBusy] = useState('0');
  const [dia1, setDia]= useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      
      
    });

    // responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    //   console.log(response);
      
    //   navigation.navigate('ready');
    // });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

/////
  
const[disab,setDisabl] =useState(false);
const[countdown,setCount]=useState(0);
const [amount2, setAmount2] = useState('0');
const [phone,setPhone]=useState('');
const [wait,setWait]= useState(false);


const abort = async ()=>{
  let uptbusy = {busy:"1"}
  
  await dialogs.doc(dia1).update(uptbusy);
  await AsyncStorage.setItem('abort', String(Math.floor(Date.now()/1000)));
  //alert(await AsyncStorage.getItem('abort'));
  setMod3(false);
  setMod(false);
  setDisabl(true);
  setWait(false)
  //navigation.navigate('main');
  
}


  const userlist = async (modname1)=>{
    
    
    if(amount2=='0'||amount2==''){Alert.alert('напишите сколько требуется бонусов.'); return false;}
    setWait(true);
    setDisabl(true);
    let dia ='';
    let phone2= await AsyncStorage.getItem('phone');
    await dialogs.add({code:"", busy:'0', phone:'', strike:false, shop:modname, phone2:phone2}).then((docRef)=>{ dia = docRef.id  });
    setDia(dia);
    const db = getFirestore();
    const unsub = onSnapshot(
      doc(db, "dialogs", dia), 
      { includeMetadataChanges: true }, 
      (doc) => {
        setPhone(doc.data().phone);
        setBusy(doc.data().busy);
      });

    //setBusy();
    
    //let arrusers = "";
    await tabusers
      .get().then(querySnapshot=>{
        
        querySnapshot.forEach(async (doc)=>{
          let summ = await (doc.data()[modname1].summ)*1;
          console.log(summ);
          let str = await (doc.data().strike);
          console.log(str);
          if (summ>amount2&&str!='5'){sendPushNotification(doc.data().tokenreg, dia); 
            // arrusers = arrusers+doc.data().tokenreg+", "; console.log(arrusers); 
          }
           
        })
        
      });
      
      setMod3(true);
      

  }
  ////////////
  useEffect(()=>{
    if(busy=='1'&&phone!=''){setMod(false);setMod3(false);setWait(false); setDisabl(false); navigation.navigate("getCode", {dialog: dia1, promo: promoid})}
    return () => {}
  },[busy])
  ////
  
  useEffect(()=>{
    const fn = async ()=>{
      if((180-(Math.floor(Date.now()/1000)-(await AsyncStorage.getItem('abort'))*1))>0){ setDisabl(true)};
      
    }
    fn();
    return () => {}
  },[countdown])
  
  
   
  

  const [sellarr, setSellarr] = useState([]);
  const sellitem = firebase.firestore().collection('sellitem');
  const [amount, setAmount] = useState('0');

  const max = (item)=>{
    let promise = new Promise((resolve, reject)=>{
      var max1=0;
      tabusers.onSnapshot(querySnapshot=>{
       
       
       querySnapshot.forEach((doc)=>{
         console.log();
         if(typeof(doc.data()[item])!='undefined'){
           //console.log(doc.data()[item].dateex.seconds);
           if(doc.data()[item].summ*1>max1&&doc.data()[item].dateex.seconds>Math.floor(Date.now()/1000)){max1=doc.data()[item].summ*1}}
         
         
       })
       //alert(max1);
       resolve(max1);
     })
    })
   return promise
   
  }
  useEffect( ()=>{
    
    const fn = async()=>{
sellitem
    .onSnapshot(querySnapshot=>{
      const sellarr = [];
      querySnapshot.forEach(async (doc)=>{
        
        const {name, img} = doc.data();
        //let maxim =await  max(name);
        max(name).then((r)=>{
          //alert(r);
          let m = String(r);
          sellarr.push({
          id: doc.id,
          name,
          img,
          maxi: m
        })
        
        setSellarr(sellarr)
        });
        //alert(name+' '+maxim);
        
      })
      
    })
    }
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
        
      >
        <View  style={{minHeight: Math.round(Dimensions.get('window').height), padding:'15%', alignItems:'center',paddingTop:'30%', backgroundColor:'#b8b8b8', height:'100%'}}>
        <AntDesign style={{marginBottom:30}} name="closecircle" size={40} color="#aaaaaa" onPress={()=>{setMod(false)}} />
        <Shadow
        distance={8}
        //style={{alignSelf: 'stretch'}}
        startColor='#c6d1d6'
        finalColor='#cecece'
        style={{borderRadius:15,width:'100%',height:80}}
        containerStyle={{height:80, borderRadius:15, backgroundColor:"white", marginTop:10}}
        
        >
        <TextInput
        editable={!disab}
        keyboardType='number-pad'
        placeholder='Сколько бонусов надо'
        style={{width:'50%', marginBottom:15, borderRadius:15, padding:15, fontSize:20, height:'100%'}}
        onChangeText={setAmount2}
        />
        </Shadow>
        <Shadow
        distance={40}
        //offset={[1,1]} 
        //style={{alignSelf: 'stretch'}}
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderLeftWidth:1, borderTopWidth:2, borderColor:'white',borderRadius:20, width:'100%'}}
        containerStyle={{ marginTop:40,  flex:1, borderRadius:15, backgroundColor:"#d6dcde", width:'100%', justifyContent:'center'}}
        
        >
          <LinearGradient colors={['#c5c8c8','#c9c9bb', '#cdcd9e']} style={{borderRadius:15,height:'100%', width:'100%',justifyContent:'center', alignContent:'center', alignItems:'center'}}>
        <TouchableOpacity disabled={disab} onPress={()=>{userlist(modname)}} style={{ width:'100%',textAlign:'center', justifyContent:'center', alignItems:'center'}}>{wait==true ? (<><ActivityIndicator size="small" color="#000000" /></>): countdown<=0 ? (<><Text style={{fontSize:20, width:250,color:'#404040',textAlign:'center', textAlignVertical:'center', height:'100%'}}>Найти бонусы в {modname}</Text></>):(
          <>
          <CountdownCircleTimer
          size={200}
          strokeWidth={5}
          onComplete={()=>{setCount(0); setDisabl(false)}}
    isPlaying
    duration={countdown}
    colors={['#e28499', '#b8a02a', '#51a056', '#73addd', ]}
    colorsTime={[150, 50, 10, 0]}
  >
    {({ remainingTime }) => <Text style={{padding:5, textAlign:'center'}}>попробовать снова через {"\n"}{Math.floor((remainingTime % 3600) / 60)}:{remainingTime % 60}</Text>}
  </CountdownCircleTimer>
        </>)}
        </TouchableOpacity>
        </LinearGradient>
        </Shadow>
        
        
       
        </View>
        
      </Modal>
             {/* окно ожидания  */}

             <Modal 
      visible={mod3}
      animationType="fade"
        
      >
        <View  style={{padding:'15%', alignItems:'center',paddingTop:'50%', backgroundColor:'#b8b8b8', height:'100%'}}>
        <Text>Идет поиск продавцов</Text>
        
        <Shadow
        distance={40}
        //offset={[1,1]} 
        //style={{alignSelf: 'stretch'}}
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderLeftWidth:1, borderTopWidth:2, borderColor:'white',borderRadius:20, width:'100%', height:'100%'}}
        containerStyle={{ marginTop:40,  flex:1, borderRadius:15, backgroundColor:"#d6dcde", width:'100%', justifyContent:'center'}}
        
        >
          <LinearGradient colors={['#c5c8c8','#c9c9bb', '#cdcd9e']} style={{borderRadius:15}}>
        <TouchableOpacity onPress={()=>{abort()}} style={{ width:'100%', textAlign:'center'}}><Text style={{fontSize:20, width:250,color:'#404040',textAlign:'center', textAlignVertical:'center', height:'100%'}}>Отменить поиск</Text></TouchableOpacity>
        </LinearGradient>
        </Shadow>
        
        
        
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
        <Pressable onPress={async ()=>{
          
          setMod(true);
          setModname(item.name);
          await setCount(180-(Math.floor(Date.now()/1000)-(await AsyncStorage.getItem('abort'))*1));
          
          //
          }}>
          <View >
             <Text style={{padding:10, fontSize:20, textAlign:'center'}}>{item.name}  </Text>
             <Text style={{marginBottom:-30, zIndex:2, textAlign:'center', color:'white'}}>максимально доступно: {item.maxi}</Text>
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

export default Buy