import { StyleSheet, View, Text, Image, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { addToCart, removeFromCart } from './redux/action';
import { useDispatch, useSelector } from 'react-redux';
const Product = (props) => {
    const item = props.item;
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.reducer);
    const [isAdded, setIsAdded] = useState(false)
    const handleAddToCart = () => {
        dispatch(addToCart(item))
    }

    const handleRemoveFromCart = () => {
        dispatch(removeFromCart(item.name))
    }
    useEffect(() => {
        let result = cartItems.filter((element) => 
            element.name === item.name

        );
       setIsAdded(result.length > 0);
    }, [cartItems , item.name])
    return (
        <View style={{ alignItems: 'center', borderBottomColor: 'orange', borderBottomWidth: 2, padding: 40 }}>
            <Text style={{ fontSize: 24 }}> {item.name}</Text>
            <Text style={{ fontSize: 24 }}> {item.price}</Text>
            <Text style={{ fontSize: 24 }}> {item.color}</Text>
            <Image source={{ uri: item.image }} style={{ width: 50, height: 100 }} />
            {
                isAdded ?
                    (<Button title='Remove to cart' onPress={handleRemoveFromCart} />) :
                    (<Button title='Add to cart' onPress={handleAddToCart} />)
            }
        </View>
    );
}

export default Product;

const styles = StyleSheet.create({
    container: {
        flex: 1,


    },
})