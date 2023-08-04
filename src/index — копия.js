import {Modal, View, Text, Alert, TextInput, TouchableOpacity, StatusBar, ActivityIndicator} from 'react-native';
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
SplashScreen.preventAutoHideAsync();
const tabusers = firebase.firestore().collection('users');

const Otp =  ({navigation}) => {
   // const [uid, setUid]=useState('');
    
    //const [load, setLoad]=useState('подождите');

    const asyncfn = async ()=>{
        if(await AsyncStorage.getItem('uid')!=null){
        console.log(await AsyncStorage.getItem('uid')); 
        
        const fn = async()=>{ await SplashScreen.hideAsync();}
        setTimeout(fn, 1000);
        navigation.navigate('main');
    }else{console.log(await AsyncStorage.getItem('uid'));
    await SplashScreen.hideAsync();}
    
}
    asyncfn();
   // const [exist, setExist]=useState(false);
    const [mod2, setMod]= useState(false);
    const [phoneNumber, setPhoneNumber]= useState('');
    const [code, setCode] = useState('');
    const [verificationId, setverificationId] = useState(null);
    const recapchaVerifier = useRef(null);
    //const [disp, setDisp] = useState('none');
    const sendVerification = ()=>{
        console.log('какой номер '+phoneNumber);
        console.log('capcha'+recapchaVerifier.current)
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
             .verifyPhoneNumber(phoneNumber, recapchaVerifier.current)
             .then(setverificationId);
             //setPhoneNumber('');
    };

    const confirmCode =async ()=>{
        var exist = false;
        var uid = '';
        setMod(true);
        const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId, 
            code
        );
       await tabusers
      .get().then(querySnapshot=>{
        
        querySnapshot.forEach(async (doc)=>{
            let tel= await (doc.data().phone);
            
            let ui = await (doc.id);
            
            if (tel==phoneNumber.replace(/[()-]/g, "")){
            
            exist=true; 
            uid=ui; 
          }
           
        })
        
      });
        firebase.auth().signInWithCredential(credential)
        .then(async (userCredential)=>{
            const user = userCredential.user;

            let phone = user.phoneNumber;
            let id = user.uid;
            const token = (await Notifications.getExpoPushTokenAsync({projectId: "7546fd6d-4af6-4e6e-af73-58b6e5577778"})).data;
            console.log(token);
            const data={
                tokenreg: token,
                uid: id,
                phone: phone,
                coupon: '0'
            }
            
            if(exist==true){

                //alert('такой юзер есть '+uid);
                const updtdata = {
                    tokenreg:token
                              }
                await tabusers.doc(uid).update(updtdata)
                .then(async()=>{
                    await AsyncStorage.setItem('uid', uid); await AsyncStorage.setItem('phone', phone); navigation.navigate('main')
                })
        
        }else{
                
            tabusers.add(data)
            .then(async (docRef)=>{ await AsyncStorage.setItem('uid', docRef.id);  await AsyncStorage.setItem('phone', phone); navigation.navigate('main')})
            .catch((error)=>{
                console.log(error);
            });
            }

            setCode('');
            
        })
        .catch((error)=>{
            setMod(false);
            //Alert.alert("код неверный. попробуйте снова");
            alert(error);
        })
        //console.log(credential);

        
    }
    
    return(
        
        <View style={{marginTop:-70,flex:1,backgroundColor:'#333333',paddingTop:45,paddingBottom:30,paddingLeft:20,paddingRight:20}}>
      
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
      <FirebaseRecaptchaVerifierModal
            ref={recapchaVerifier}
            firebaseConfig={firebaseConfig}

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
            {/* <TextInput
            style={styles.input}
            onChangeText={setPhoneNumber}
            /> */}
            
            <Shadow
            distance={15}
            //style={{alignSelf: 'stretch'}}
            startColor='#bfc1c2'
            finalColor='#cecece'
            style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'#b3b3b361', width:'100%'}}
        containerStyle={{   borderRadius:15, backgroundColor:"#d6dcde", marginBottom:20, height:80, width:'100%'}}
        
            >
                <LinearGradient colors={['#bbc5da','#bec6d7','#c5c8c8']} style={{borderRadius:15, width:'100%', height:'100%'}}>
                <TouchableOpacity style={{borderRadius:15,flex:1, justifyContent:'center', display:'flex'}} onPress={sendVerification}>
                    <Text style={{fontSize:20, textAlign:'center'}}>
                        Получить смс код
                    </Text>

                </TouchableOpacity>
                </LinearGradient>
            </Shadow>
                  <Shadow
                  distance={8}
                  //style={{alignSelf: 'stretch'}}
                  startColor='#c6d1d6'
                  finalColor='#cecece'
                  style={{borderRadius:15,width:'100%',height:80, padding:0}}
                  containerStyle={styles.input}
                 
                  >  
                <TextInput style={{backgroundColor:'white', fontSize:20, width:'100%', height:'100%', borderRadius:20, textAlign:'center'}}
            placeholder='Введите код'
            onChangeText={setCode}
            keyboardType='number-pad'
                />
                </Shadow>

                <Shadow
            distance={15}
            //style={{alignSelf: 'stretch'}}
            startColor='#bfc1c2'
            finalColor='#cecece'
            style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, borderColor:'#b3b3b361', width:'100%'}}
        containerStyle={{   borderRadius:15, backgroundColor:"#d6dcde", marginBottom:20, height:80, width:'100%'}}
        
            >
                <LinearGradient colors={['#c5c8c8','#d1d1c4', '#d2d2c0']} style={{borderRadius:15, width:'100%', height:'100%'}}>
                <TouchableOpacity style={{borderRadius:15,flex:1, justifyContent:'center', display:'flex'}} onPress={confirmCode}>
                    <Text style={{color:'black',fontSize:20, textAlign:'center'}}>
                        Подтвердить
                    </Text>

                </TouchableOpacity>
                  </LinearGradient>
                 </Shadow>   
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