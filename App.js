
import { StyleSheet, Text, View, LogBox, Modal, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import Pay from './src/pay'
import Main from './src/main'
import Otp from './src/index'
import Buy from './src/buy'
import Sell from './src/sell'
import Ready from './src/ready'
import GetCode from './src/getCode'
import SendCode from './src/sendCode'
import Info from './src/info';
import { createStackNavigator } from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import setDefaultProps from 'react-native-simple-default-props'
import * as Font from 'expo-font'
import Constants from "expo-constants"
import { AntDesign } from '@expo/vector-icons'
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Shadow } from 'react-native-shadow-2';
import {LinearGradient} from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const defaultText = {
  style: [{fontFamily: 'exo'}],
};


setDefaultProps(Text, defaultText);



SplashScreen.preventAutoHideAsync();
const Stack  = createStackNavigator();
LogBox.ignoreLogs(['Warning: ...']);

const asyncfn = async ()=>{

  

  await AsyncStorage.removeItem('dial');
  await AsyncStorage.removeItem('shop');
  await Font.loadAsync({
    'exo': require('./assets/fonts/Exo2-VariableFont_wght.ttf'),
    'exo-italic': require('./assets/fonts/Exo2-Italic-VariableFont_wght.ttf'),
  });
  
}
asyncfn();

let androidExitedListener;

  if (Platform.OS == 'android') {
    androidExitedListener = Notifications.addNotificationResponseReceivedListener(async ({ notification }) => { 
      let dial = await JSON.stringify(notification.request.content.data.dialid1);
      let shop = await JSON.stringify(notification.request.content.data.shop);
      await AsyncStorage.setItem('dial', dial);
      await AsyncStorage.setItem('shop', shop);
      
    });
  }

export default function App() {

  const[down,setDown]=useState(false);
  const[grsell,setSell]=useState(['#c5c8c8','#c9c9bb', '#cdcd9e']);
  const [mod2,setMod2]=useState(false);
  const [info,setInfo]=useState('');
  const [currentProgress, setProgress] = useState(0);
  const callback = downloadProgress => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    //console.log(downloadProgress, progress);
    setProgress(progress * 100);
    if (progress >= 1 || progress < 0) {
      //setProgress(0);
    }
  };

  const downloadFile = async (endpoint, fileName) => {
   
    setDown(true);

    try {
      // const Permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      // const fileUri = Permission.directoryUri;
      // console.log(Permission);
      const downloadResumable = FileSystem.createDownloadResumable(
        endpoint,
        FileSystem.documentDirectory + fileName,
        {},
        callback
      );
      downloadResumable.downloadAsync().then(async ({uri}) => {
        console.log('Finished downloading ', uri);
        const contentURL = await FileSystem.getContentUriAsync(uri);
          
       const res =  await IntentLauncher.startActivityAsync(
          'android.intent.action.INSTALL_PACKAGE',
          {
            data: contentURL,
            flags: 1,
            //type: 'application/vnd.android.package-archive',
           
          }
        );
        console.log(contentURL)
      });
      // console.log(uri); 
      // Linking.openURL(uri);
      
      if (fileName === 'hadices.json') {
        
      }
    } catch (e) {
      console.error(e);
    }
  };

  const asfn = async ()=>{
    const db = getFirestore();
const docRef = doc(db, "version", '1');
const docSnap = await getDoc(docRef);
const curver = docSnap.data().version;
const info1 = docSnap.data().info;
setInfo(info1);
const verapp = Constants.manifest.version;
const actual = curver==verapp;
 
  if(!actual){setMod2(true)}
console.log(actual);
  }
 asfn();
 
  // const [count,setCount]= useState(0);
  // const [reg,setReg]=useState(null);
  
  let androidExitedListener;

  if (Platform.OS == 'android') {
    androidExitedListener = Notifications.addNotificationResponseReceivedListener(async ({ notification }) => { 
      let dial = await JSON.stringify(notification.request.content.data.dialid1);
      await AsyncStorage.setItem('dial', dial);
      //reg = setReg(await AsyncStorage.getItem('uid'));
    });
  }

  
  // useEffect(()=>{
  //   const fn2 = async ()=>{
  //     //alert(reg);
  //     if(reg!=null){await SplashScreen.hideAsync();}
  //   }
  //   fn2();
  // },[])
  
  return (
    

    <NavigationContainer>
      <Modal 
      visible={mod2}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}><Text  style={{fontSize:25}}></Text>
        <Text>Есть новая версия:</Text><Text style={{marginBottom:30}}>{info}</Text>
        <AnimatedCircularProgress
        
  size={200}
  width={7}
  fill={Math.floor(currentProgress)==100?100:Math.floor(currentProgress)}
  tintColor="#4a94c766"
  backgroundColor="#bbbbbb">
  {
    (fill) => (
      
      <Shadow
        distance={40}
        //#bfc1c2
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:50, borderLeftWidth:0, borderTopWidth:0, height:200, borderColor:'white'}}
        containerStyle={{   borderRadius:50, backgroundColor:"#d6dcde",   height:200, marginBottom:0}}
        //offset={[8,15]}
        >
          <LinearGradient colors={grsell} style={{borderRadius:50}}>  
        <TouchableOpacity  onPressOut={()=>{setSell(['#c5c8c8','#c9c9bb', '#cdcd9e'])}} onPressIn={()=>{setSell(['#cdcd9e','#c9c9bb','#c5c8c8' ])}} 
        onPress={()=>{
          downloadFile('https://bonus-back.ru/bb/bonus-back.apk',
          'bonusbank.apk');
        }} 
          style={{width:'100%', height:200, textAlign:'center'}}>
             <Text style={{fontSize:20, width:200,color:'white',textAlign:'center', textAlignVertical:'center', height:200}} >
              {down?(<>загрузка</>):(<>обновить</>)}
              </Text>
        </TouchableOpacity>
        </LinearGradient>
        </Shadow>
    )
  }

        {/*  */}
        </AnimatedCircularProgress>
        
        </View>
        </Modal>

        <Stack.Navigator>
            
        <Stack.Screen
           
           name="index"
           component={Otp}
           options={{title:'Регистрация',
           headerTitleAlign:'center',
           headerTintColor:'white',
           headerStyle:{backgroundColor:'transparent', height:70},
           headerTitleStyle:{color:'white'},
           headerShadowVisible: false, // applied here
           headerBackTitleVisible: false,
            
       }}
           /><Stack.Screen
            name="main"
            component={Main}
            options={{title:'Главная',
            headerLeft: ()=> null, 
            gesturesEnabled: false,
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
                    }}
            />
        <Stack.Screen
            name="info"
            component={Info}
            options={{title:'Как это работает',
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
             
        }}
            />
        <Stack.Screen
            name="getCode"
            component={GetCode}
            options={{title:'Получение кода',
            headerLeft: ()=> null, 
            gesturesEnabled: false,
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
             
        }}
            />
        <Stack.Screen
            name="sendCode"
            component={SendCode}
            options={{title:'Не закрывайте приложение',
            headerLeft: ()=> null, 
            gesturesEnabled: false, 
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
             

        }}
            /><Stack.Screen
            name="buy"
            component={Buy}
            options={{title:'Купить',
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
        }}
            />
            <Stack.Screen
            name="pay"
            component={Pay}
            options={{title:'Покупка талона',
            headerTitleAlign:'center',
            headerTintColor:'black',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'black'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
        }}
            />
        <Stack.Screen
            
            name="sell"
            component={Sell}
            options={{title:'Продать',
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false, }}
            />
        <Stack.Screen
            name="ready"
            component={Ready}
            options={{title:'Готовность',
            headerTitleAlign:'center',
            headerTintColor:'white',
            headerStyle:{backgroundColor:'transparent', height:70},
            headerTitleStyle:{color:'white'},
            headerShadowVisible: false, // applied here
            headerBackTitleVisible: false,
                
        }}
            />
            
         </Stack.Navigator>
     </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:'center',
    justifyContent:'center',
    flex: 1,
    textAlign:'center'
    
  },
});
