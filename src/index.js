import {Dimensions, Modal, View, Text, Alert, TextInput, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config';
import firebase from 'firebase/compat/app';
import {getFirestore,doc, getDoc} from 'firebase/firestore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { MaskedTextInput } from "react-native-mask-text";
import { Shadow } from 'react-native-shadow-2';
import {LinearGradient} from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';
SplashScreen.preventAutoHideAsync();
const tabusers = firebase.firestore().collection('users');

GoogleSignin.configure({
    scopes: ['profile', 'email'],
    offlineAccess: true,
    webClientId: '617626373025-6j6vc8uoufrrmlbede4qm39d67rc51ie.apps.googleusercontent.com',
    androidClientId: "617626373025-drjlbsggb876b080p84i2us3lh1g4dvj.apps.googleusercontent.com"
  });

const Otp =  ({navigation}) => {
    const [disphone, setDisphone] = useState(false);
    const [dispin, setDispin] = useState(false);
    const[checked,setChecked] = useState(0);
    const[call,setCall] = useState(false);
    const [phoneNumber, setPhoneNumber]= useState('');
    const [pinuser,setPinuser] = useState(0);
    const [pin,setPin]=useState(0);
    const callme = ()=>{
        setDisphone(true);
        if (phoneNumber.length<15){Alert.alert("Номер телефона не корректно указан."); return false;}
        let pin1= Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        setPin(pin1);
        
        
        console.log('звоним вам');
        setCall(true);
       
          axios({
            method:'post', 
            url: 'https://direct.i-dgtl.ru/api/v1/message',
            headers: {
                'Authorization': 'Basic NTA2NjoxcmpyRTgxOWV2aWtzTjhTRVB3b0xh',
                'Content-Type': 'application/json'
              },
              data: [{
                  channelType: "FLASHCALL",
                      senderName: "FLASHCALL",
                      destination: phoneNumber.replace(/[()-]/g, ""),
                      content: pin1,
                      ttl:70
              }]
        }).then((response)=>{console.log(response)});


//         fetch('https://direct.i-dgtl.ru/api/v1/message', {
//   method: 'POST',
  
//   headers: {
//     Accept: 'application/json',
//     'Authorization': 'Basic NTA2NjoxcmpyRTgxOWV2aWtzTjhTRVB3b0xh',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
    
//     channelType: "FLASHCALL",
//     senderName: "FLASHCALL",
//     destination: "79831632412",
//     content: "1234",
//     ttl:"70"
//   }),
// }).then((response)=>{console.log(response)}).catch((error)=>{console.log(error)});
    }
   // const [uid, setUid]=useState('');
    
    //const [load, setLoad]=useState('подождите');

    const asyncfn = async ()=>{
        if(await AsyncStorage.getItem('uid')!=null){
        console.log('!!!!!!!!!!!!!!!!!!!!!!!'+await AsyncStorage.getItem('uid')); 
        
        const fn = async()=>{ await SplashScreen.hideAsync();}
        setTimeout(fn, 1000);
        navigation.navigate('main');
    }else{console.log(await AsyncStorage.getItem('uid'));
    await SplashScreen.hideAsync();}
    
}
    asyncfn();
    const[mail,setMail]=useState('');
    const[ui, setUi]=useState('');
    //const [exist, setExist]=useState(false);
    const [mod2, setMod]= useState(false);
    
    const [code, setCode] = useState('');
    const [verificationId, setverificationId] = useState(null);
    const recapchaVerifier = useRef(null);
    //const [disp, setDisp] = useState('none');
    
    const onGoogleButtonPress= async()=> {
        setMod(true);
        if (checked==0){Alert.alert("Сначала зарегистрируйте свой номер телефона."); return false;}
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        const singin = firebase.auth().signInWithCredential(googleCredential);
        singin.then(async (user)=>{
            var exist = 0;
            var mail= user.user.email;
            var docid;
            var ui =user.user.uid;
            console.log(user.user.email+'  '+user.user.uid);
            await tabusers
            .get().then(querySnapshot=>{
              new Promise((resolve)=>{
                querySnapshot.forEach(async (doc)=>{
                  var phone =  await (doc.data().phone);
                  
                  if (phoneNumber.replace(/[()-]/g, "")==phone){
                  docid = await (doc.id);
                  exist = 1; 
                  //alert(exist);
                }
                 
              })
              })
              return Promise;
              
            }).then(async ()=>{
                
            let phone = phoneNumber.replace(/[()-]/g, "");
            let id = ui;
            const token = (await Notifications.getExpoPushTokenAsync({projectId: "7546fd6d-4af6-4e6e-af73-58b6e5577778"})).data;
            console.log(token);
            let promo= Math.random().toString(36).slice(-8);
            const data={
                tokenreg: token,
                uid: id,
                strike:'0',
                mail: mail,
                phone: phone,
                coupon: '0',
                used:false,
                promo: promo
            }
            console.log('exist= '+exist);
            if(exist==1){

                //alert('doc id '+docid);
                const updtdata = {
                    mail:mail,
                    tokenreg:token,
                    
                              }
                await tabusers.doc(docid).update(updtdata)
                .then(async()=>{
                    setMod(true);
                    await AsyncStorage.setItem('uid', docid); 
                    await AsyncStorage.setItem('phone', phone); 
                    navigation.navigate('main');
                    setMod(false);
                })
        
        }else{
            //alert('noo user'+id);  
            tabusers.add(data)
            .then(async (docRef)=>{ 
                setMod(true);
                await AsyncStorage.setItem('uid', docRef.id);  
                await AsyncStorage.setItem('phone', phone);  navigation.navigate('main');setMod(false);})
            .catch((error)=>{
                console.log(error);
            });
            }
        }).catch((error)=>{console.log(error)})
    })
      }

    
    
    return(
        
        <View style={{minHeight: Math.round(Dimensions.get('window').height), marginTop:-70,flex:1,backgroundColor:'#333333',paddingTop:45,paddingBottom:30,paddingLeft:20,paddingRight:20}}>
      
      <Modal 
      visible={mod2}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}><Text  style={{fontSize:25}}></Text>
        <ActivityIndicator size="large" color="#000000" />
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
       style={{borderRadius:20,height:'100%', width:'100%', flex:1,paddingTop:5}}
       containerStyle={{marginTop:30,backgroundColor:'#cecece', width:'100%',flex:1, borderWidth:2,borderRadius:20, padding:30,display:'flex', flexDirection:'column'}}
     
            >
            <View style={{alignItems:'center',flex:1, width:'100%',height:'100%', display:'flex',flexDirection:'column', alignItems:'flex-start'}}>
            
                {checked?(<>
                    <Text style={{fontSize:20, marginBottom:20}} >
                Продолжить с помощью Google:
            </Text>
            <Shadow
            distance={15}
            //style={{alignSelf: 'stretch'}}
            startColor='#bfc1c2'
            finalColor='#cecece'
            style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'#b3b3b361', width:'100%'}}
        containerStyle={{   borderRadius:15, backgroundColor:"#d6dcde", marginBottom:20, height:80, width:'100%'}}
        
            >
                <LinearGradient colors={['#bbc5da','#bec6d7','#c5c8c8']} style={{borderRadius:15, width:'100%', height:'100%'}}>
                <TouchableOpacity style={{borderRadius:15,flex:1, justifyContent:'center', display:'flex'}} onPress={()=>onGoogleButtonPress()}>
                    <Text style={{fontSize:20, textAlign:'center'}}>
                        войти
                    </Text>

                </TouchableOpacity>
                </LinearGradient>
            </Shadow> 
                </>):(<>
                    <Text style={{fontSize:20, marginBottom:20}} >
                Зарегистрируйте свой номер телефона, на котором у вас есть бонусы в магазинах.
            </Text>
            <Shadow
            distance={8}
            //style={{alignSelf: 'stretch'}}
            startColor='#c6d1d6'
            finalColor='#cecece'
            style={{borderRadius:15,width:'100%',height:80, padding:0}}
            containerStyle={styles.input}
            
            >
            <MaskedTextInput
            editable={!disphone}
            keyboardType='numeric'
            //inputMode='tel'
            value="+7"
            style={{backgroundColor:'white', fontSize:20, width:'100%', height:'100%', borderRadius:20, textAlign:'center'}}
            onChangeText={(text, rawText) => {
            setPhoneNumber(text);
    // +1 (123) 456-78-90
   // console.log(extracted) // 1234567890
             }}
             mask="+7(999)999-9999"
            />
            </Shadow>
            <Text style={{fontSize:12, marginBottom:20}} >
                Вам поступит звонок. Введите последние 4 цифры входящего номера в поле для кода. Если входящего звонка не было, проверьте пропущенные вызовы.
            </Text>
            {call?(<>
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
            keyboardType='numeric'
            style={{backgroundColor:'white', fontSize:20, width:'100%', height:'100%', borderRadius:20, textAlign:'center'}}
            onChangeText={(text) => {
                console.log(text+'  '+pin);
                //setPinuser(text);
                if(text.length==4&&pin==text*1){setChecked(true);setDispin(true);}
                else if(text.length==4&&pin!=text*1){Alert.alert('код не верный');}

            

    // +1 (123) 456-78-90
   // console.log(extracted) // 1234567890
             }}
             mask="9999"
            /></Shadow></>):(<><Shadow
            distance={15}
            //style={{alignSelf: 'stretch'}}
            startColor='#bfc1c2'
            finalColor='#cecece'
            style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'#b3b3b361', width:'100%'}}
        containerStyle={{   borderRadius:15, backgroundColor:"#d6dcde", marginBottom:20, height:80, width:'100%'}}
        
            >
                <LinearGradient colors={['#bbc5da','#bec6d7','#c5c8c8']} style={{borderRadius:15, width:'100%', height:'100%'}}>
                <TouchableOpacity style={{borderRadius:15,flex:1, justifyContent:'center', display:'flex'}} onPress={()=>callme()}>
                    <Text style={{fontSize:20, textAlign:'center'}}>
                        запросить код
                    </Text>

                </TouchableOpacity>
                </LinearGradient>
            </Shadow></>)}
                </>)}
            
                       
            
                </View>
                </Shadow>
        </View>
    )
}


export default Otp

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