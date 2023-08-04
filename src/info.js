import {Modal, View, Text, TouchableOpacity, Alert, Linking, StatusBar, ScrollView } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {getFirestore,doc, getDoc, setDoc} from 'firebase/firestore'
import firebase from 'firebase/compat/app'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Shadow } from 'react-native-shadow-2';
import {LinearGradient} from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const Info = ({navigation}) => {
  const [mod1,setMod1] = useState(false);
  const [mod2,setMod2] = useState(false);

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
      
      <Modal 
      visible={mod1}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ padding:15,alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}><Text  style={{fontSize:25}}></Text>
        <AntDesign style={{marginBottom:30}} name="closecircle" size={40} color="#bbb" onPress={()=>{setMod1(false)}} />
        <ScrollView>
        <Text style={{fontSize:17, textAlign:'left'}}><Text style={{textAlign:'center', fontSize:22}}>Если вам срочно нужны бонусы в каком то магазине, то вы можете найти их в нашем сервисе.</Text> {"\n"}
        {"\u00A0\u00A0\u00A0\u00A0\u00A0"}Для поиска и получения бонусов необходимы талоны. 1 талон - 1 поиск и получение бонусов {"(Не зависимо от суммы бонусов которую вы ищете)"}. 
         В разделе "Покупка" выбирайте нужный магазин и запрашивайте поиск нужной суммы бонусов. 
         Начинайте поиск бонусов, когда вы уже определились с покупкой и готовы идти на кассу. 
         Когда найдется продавец,в приложении высветится его номер. Назовите его на кассе. 
         После этого вам придет нужный код для подтверждения.{"\n"}
         <Text style={{textAlign:'center', fontSize:22}}>Где взять талоны?</Text> {"\n"}
         {"\u00A0\u00A0\u00A0\u00A0\u00A0"}Талон дается за успешную продажу бонусов. Вы можете выставить свои бонусы на продажу, после продажи вам начисляется 1 талон, или вы можете оплатить 200р и получить 1 талон.  </Text>
         </ScrollView>
        </View>
        </Modal>
      {/* ///////////////////////// */}
      <Modal 
      visible={mod2}
      animationType="fade"
      transparent={true}
      >
        
        <View  style={{ padding:15,alignItems:'center', backgroundColor:'#cecece', height:'100%', justifyContent:'center'}}>
        <AntDesign style={{marginBottom:30}} name="closecircle" size={40} color="#bbb" onPress={()=>{setMod2(false)}} />
<ScrollView>
        <Text style={{fontSize:17, textAlign:'left'}}><Text style={{textAlign:'center', fontSize:22}}>Продайте бонусы которыми вы не пользуетесь, тем кому они нужны.</Text> {"\n"}
        {"\u00A0\u00A0\u00A0\u00A0\u00A0"}В разделе "Продать"  укажите сколько у вас есть бонусных балов и в каких магазинах. 
        Укажите дату окончания срока их действия, желательно днем раньше. 
        Когда они понадобятся другому пользователю, вам придет уведомление. 
        После того как вы подтвердите готовность, покупатель называет ваш номер на кассе. 
        Вам приходит смс с кодом. Тут ни чего делать не надо, приложение само считает код и отправит его.{"\n"} 
             {"\u00A0\u00A0\u00A0\u00A0\u00A0"}За успешную продажу вам начислится 1 талон. 
        Этот талон вы сможете в любое время потратить на поиск и получение бонусов в магазинах из списка.{"\n"}
        {"\u00A0\u00A0\u00A0\u00A0\u00A0"}Если после подтверждения готовности продать бонусы, вы передумаете и закроете приложение или у вас потеряется 
        связь с сотовй сетю или интернетом, то мы не сможем передать код покупателью.
         За это вы получите 1 страйк. Если у вас накопится много страйков, то ваш номер будет заблокирован.
         
        </Text>
        </ScrollView>
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
      {/* <Text style={{fontSize:17, textAlign:'center'}}>Вы готовы принять код от магазина? {"\n\n"}Убедитесь что у вас стабильное соединение с интернетом и мобильной сетью.{"\n\n"}Приложение в автоматическом режиме прочитает код из смс от магазина.</Text> */}
      <Shadow
        distance={40}
        
        //offset={(20 || 20)}
        //#a3a3a3
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:60,width:200, alignSelf:'center'}}
        >
       
        <LinearGradient colors={['#acbbdb','#bec6d7','#c5c8c8']} style={{borderRadius:15, height:100}}>  
      <TouchableOpacity 
      onPress={()=>{setMod1(true)}}
       style={{ borderRadius:15, flex:1, justifyContent:'center' }}>
        <Text style={{textAlign:'center', color:'white', fontSize:20}}>покупка</Text>
      </TouchableOpacity>
      </LinearGradient>
      </Shadow>
      <Shadow
        distance={40}
        
        //offset={(20 || 20)}
        //#a3a3a3
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:100}}
        containerStyle={{marginTop:40,  borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:30,width:200, alignSelf:'center'}}
        >
       
        <LinearGradient colors={['#acbbdb','#bec6d7','#c5c8c8']} style={{borderRadius:15, height:100,}}>  
      <TouchableOpacity 
            onPress={()=>{setMod2(true)}}

       style={{borderRadius:15, flex:1, justifyContent:'center'}}>
        <Text style={{textAlign:'center', color:'white', fontSize:20}}>продажа</Text>
      </TouchableOpacity>
      </LinearGradient>
      </Shadow>
      <Text style={{zIndex:2,textAlign:'center', color:'white', fontSize:20}}>Есть вопросы или предложения?</Text>
      <Shadow
        distance={40}
        
        //offset={(20 || 20)}
        //#a3a3a3
        startColor='#a3a3a3'
        finalColor='#cecece'
        style={{borderRadius:20, borderLeftWidth:1, borderTopWidth:2, width:200,borderColor:'white',height:70}}
        containerStyle={{marginTop:10,  borderRadius:15, backgroundColor:"#d6dcde",  marginBottom:60,width:200, alignSelf:'center'}}
        >
       
        <LinearGradient colors={['#acbbdb','#bec6d7','#c5c8c8']} style={{borderRadius:15, height:70,}}>  
      <TouchableOpacity 
            onPress={()=>{Linking.openURL('tg://resolve?domain=BonusBankSupport_bot')}}

       style={{borderRadius:15, flex:1, justifyContent:'center', flexDirection:'row',alignItems:'center'}}>
        <Text style={{textAlign:'center', color:'white', fontSize:18, flex:3}}>напишите нам в телеграм</Text>
        <FontAwesome5 style={{flex:1}} name="telegram-plane" size={40} color="white" />

      </TouchableOpacity>
      </LinearGradient>
      </Shadow>

</View>
</Shadow>
    </View>
  )
}

export default Info