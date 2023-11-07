import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  setDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import {toast} from 'react-toastify';
import { db } from "../firebase";
import axios from "axios";
const initialState = { products: [], loading: true, orders: [], cart: null };



const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCart: (state, action) => {
      return {
        ...state,
        cart: action.payload,
        loading: false,
      };
    },
    setOrders: (state, action)=>{
      return {
        ...state,
        orders: action.payload,
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInitialState.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(getInitialState.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          products: [...action.payload],
        };
      })
  },
});



//  Async Thunk
export const getInitialState = createAsyncThunk(
  "products/initialState",
  async () => {
    const response = await axios.get("https://fakestoreapi.com/products/");
    return response.data;
  });



export const getOrdersThunk = createAsyncThunk(
  "products/orders",
  async (user, thunkAPI) => {
    const orderRef = collection(db, "orders");
    const query1 = query(orderRef, where("userId", "==", user.uid));

    getDocs(query1).then(async (snapshot) => {
      if (snapshot.size > 0) {
        // A document with the specified userId exists in the "carts" collection
      } else {
        // No document with the specified userId exists Add a new document with a generated id
        const cartRef = doc(collection(db, "orders"));

        // later...
        await setDoc(cartRef, { userId: user.uid, orders: null });
        console.log("orders doc  does not exist new created");
      }
    });
    //  get realtime updates on cart

      const unsubscribe = onSnapshot(
        query(collection(db, "orders"), where("userId", "==", user.uid)),
        (snapshot) => {
          const orders = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          thunkAPI.dispatch(actions.setOrders(orders[0]));
          
        });
  });




export const getCartThunk = createAsyncThunk(
  "products/getCart",
  async (user, thunkAPI) => {
    let unsubscribe;
    try {
      const cartRef = collection(db, "carts");
      const query1 = query(cartRef, where("userId", "==", user.uid));

      const snapshot = await getDocs(query1);

      if (snapshot.size > 0) {
        // A document with the specified userId exists in the "carts" collection
      } else {
        // No document with the specified userId exists
        // Add a new document with a generated id
        const cartRef = doc(collection(db, "carts"));
        await setDoc(cartRef, { userId: user.uid, products: null });
        console.log("Cart does not exist, created a new one");
      }
      // Listen for realtime updates on cart
      unsubscribe = onSnapshot(
        query(collection(db, "carts"), where("userId", "==", user.uid)),
        (snapshot) => {
          const cart = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          thunkAPI.dispatch(actions.setCart(cart[0]));
        }
      );

    } catch (error) {
      // Handle any errors
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }
);



export const addToCartThunk = createAsyncThunk(
  "products/addToCart",
  async ({ product, cart }) => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        product.quantity = 1;
        const cartRef = doc(db, "carts", cart.id);
        await updateDoc(cartRef, {
          products: arrayUnion(product),
          // products: {...cart.products, product}
        });
        toast.success("Product added to cart");
      }else{
        toast.error("login/signup to add to cart");      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.code);
    }
  }
);




// update the cart
export const updateCartThunk = createAsyncThunk(
  "products/updateCart",
  async ({ updatedProducts, cart }, thunkAPI) => {
    // console.log(updatedProducts)
    const cartRef = doc(db, "carts", cart.id);
    try {
      // Check if the updatedProducts object has a valid 'products' field
      if (updatedProducts) {
        // Update the 'products' field with the new data
        await updateDoc(cartRef, {
          products: [...updatedProducts],
        });
      } else {
        console.error("Invalid or missing 'products' field in updated data.");
      }
    } catch (error) {
      toast.error(error.code);
    }
  }
);



export const placeOrderThunk = createAsyncThunk(
  "products/placeOrder",
  async ({ order, ordersId }, thunkAPI) => {
    try {
      const orderRef = doc(db, "orders", ordersId);
      // Check if the updatedProducts object has a valid 'products' field
      if (order) {
        // Update the 'products' field with the new data
        await updateDoc(orderRef, {
          orders: arrayUnion(order),
        });
        toast.success("Order placed successfully");
      } else {
        console.error("Invalid or missing 'order' field in updated data.");
        toast.error("Invalid or missing 'order' field in updated data.");
      }
    } catch (error) {
      console.error("Error updating the order:", error);
      toast.error("Error updating the order:", error);
    }
  }
);



export const productsReducer = productSlice.reducer;
export const actions = productSlice.actions;

// selector
export const productSelector = (state) => state.productsReducer;
