
import React, { useEffect, useState } from 'react'
import Main from './src/main'
import Otp from './src/index'
import Buy from './src/buy'
import Sell from './src/sell'
import Ready from './src/ready'
import GetCode from './src/getCode'
import SendCode from './src/sendCode'
import Info from './src/info'

import { createStackNavigator } from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'

import AsyncStorage from '@react-native-async-storage/async-storage';
var unsig='';  
const Stack  = createStackNavigator();
// const check = async ()=>{
        
//     uid = await AsyncStorage.getItem('uid');
//     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!+'+(uid!=null));
//     if(uid!=null){unsig='1';}else{unsig='0';}
//     console.log('check');
//     }
// check().then(()=>{});
   
AsyncStorage.getItem('uid').then(()=>{unsig='22'})


export default function  Navigate (){
    
    
    return (<NavigationContainer>
        <Stack.Navigator>
            { unsig=='22' ?  ( <>
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
            name="info"
            component={Info}
            options={{title:'Как это работает',
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
            />
        <Stack.Screen
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
            /></>):(<>
         <Stack.Screen
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
            name="info"
            component={Info}
            options={{title:'Как это работает',
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
            /> 
        <Stack.Screen
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
            /></>)    
         }   
        </Stack.Navigator>
     </NavigationContainer>)
    
  
}
