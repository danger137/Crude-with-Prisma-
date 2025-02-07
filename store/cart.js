import { createSlice } from "@reduxjs/toolkit";

// session managemetn

let cartSlice = createSlice({
    name:'cartSlice',
    initialState:{
        items:[]
    },
    reducers:{
        decItem:(puranaData, nyaData)=>{

            let productPara = puranaData.items.find(function(item){
                return item._id == nyaData.payload._id;
            })

            if(productPara.qty > 1){
                productPara.qty--;
            }

        },
        incItem:(puranaData, nyaData)=>{

            let productPara = puranaData.items.find(function(item){
                return item._id == nyaData.payload._id;
            })

            productPara.qty++;
            
        },
        //        state         action
        addItem:(puranaData, nyaData)=>{

            let productPara = puranaData.items.find(function(item){
                return item._id == nyaData.payload._id;
            })

            if(!productPara){
                puranaData.items.push({
                    qty:1,
                    ...nyaData.payload
            });
            }else{
                productPara.qty++;
            }
        },
        removeItem:(puranaData, nyaData)=>{

            puranaData.items = puranaData.items.filter(function(item){
                return item._id != nyaData.payload
            })

            // puranaData.items.splice(nyaData.payload, 1);
        }
    }

})

export default cartSlice;
export let {addItem, removeItem,incItem, decItem} = cartSlice.actions;