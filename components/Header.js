import { StyleSheet,View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
   
    const cartData = useSelector((state)=>state.reducer)
    const [cartItems, setCartItems] =useState(0)

    useEffect(()=>{
        setCartItems(cartData.length)
    },[cartData])
  return (
    <View style={styles.container} >
      <Text style={{fontSize:20,textAlign:'right',padding:20,backgroundColor:'orange',text:'blue'}}> {cartItems}</Text>
    </View>
      
    
  )
}

export default Header;

const styles = StyleSheet.create({
  container:{
    marginTop:18,
    
  },
})