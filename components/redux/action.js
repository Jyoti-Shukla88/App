import {ADD_TO_CART,REMOVE_FROM_CART} from './constants'

export const addToCart = (item) => ({
        type:ADD_TO_CART,
        payload:item
    });
export const removeFromCart = (itemName) => ({
        type:REMOVE_FROM_CART,
        payload:itemName
    });