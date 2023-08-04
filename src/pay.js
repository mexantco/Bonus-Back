import { View, Text, Alert } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import {getFirestore,doc, getDoc, setDoc,onSnapshot, ref} from 'firebase/firestore'
import firebase from 'firebase/compat/app'

var webstate = false;
const Pay = ({navigation, route}) => {
    const uid = route.params.uid;
    const tabusers = firebase.firestore().collection('users');
const increment = firebase.firestore.FieldValue.increment(1);
const uptcoupone = {
    coupon: increment,
    strike:0
} 
    handleWebViewNavigationStateChange =  (newNavState) => {
        
        
        // newNavState looks something like this:
        // {
        //   url?: string;
        //   title?: string;
        //   loading?: boolean;
        //   canGoBack?: boolean;
        //   canGoForward?: boolean;
        // }
        const { url } = newNavState;
        console.log(url);
        if (!url) return;
        if (url.includes('userId')) {
            let id = url.split("userId");
            console.log(id[1]);
            if(uid==id[1]){ tabusers.doc(uid).update(uptcoupone); navigation.navigate("main"); Alert.alert("Спасибо","Вам начислен 1 талон")}
            // open a modal with the PDF viewer
          }
    }


    
    const runfirst = `
    function ready(){
    var elem = document.getElementsByClassName('MuiPaper-root');
    elem = elem[0];
    elem.style.display = 'none';
    var elem3 = document.getElementsByClassName('qa-quickpay-info-receiver');
    elem3 = elem3[0];
    elem3.style.display = 'none';
    var elem2 = document.getElementsByClassName('qa-quickpay-info-title');
    elem2 = elem2[0];
    elem2.innerHTML='<span style="font-size:1.5em;">в приложении бонус-бэк</span>';
    
}
document.addEventListener("DOMContentLoaded", ready);
    true;
    `;
   
  
  return (
    <WebView
        source={{ uri: 'https://yoomoney.ru/quickpay/confirm.xml?receiver=410013213230959&quickpay-form=button&paymentType=АС&sum=200&successURL=https://spacemix.ru?userId'+uid }}
        
        injectedJavaScriptBeforeContentLoaded={runfirst}
        onNavigationStateChange={async(newNavState)=>{
           
            webstate=!webstate;
            console.log('state='+webstate);
            if(webstate==false){
                
                
            console.log('переход'); 
            const { url } = newNavState;
            console.log(url);
            if (!url) return;
            if (url.includes('success')) {
                
            //let id = url.split("userId");
            
            //if(uid==id[1]){ 
              await tabusers.doc(uid).update(uptcoupone); 
              navigation.navigate("main"); 
              Alert.alert("Спасибо","Вам начислен 1 талон");
            //}
            
          }}
        }}
      />
  )
}

export default Pay