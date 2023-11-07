import React, { useEffect } from 'react'
import styles from './Orders.module.css'
import { getOrdersThunk, productSelector } from '../../redux/productsSlice';
import {  authSelector, actions, fetchAuthState } from "../../redux/authenticationSlice";

import { useSelector, useDispatch } from "react-redux";

function Orders() {
  const {orders} = useSelector(productSelector);



  if(!orders || !orders.orders || orders.orders.length === 0){
    return <h1>No Orders Yet</h1>
  }



  return (
    <div>
      {
        orders.orders.map((order,index) => {
         return (

          <table key={index}>
            <caption><h2>Ordered On : {order.date}</h2></caption>
            <tbody>
          <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
          </tr>
          {
            order.products.map((item,index)=>{
             return (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.price * item.quantity}</td>
              </tr>
             )
            })
          }
          </tbody>
      </table>
         )
        })
      }
    </div>
  )
}


export default Orders
