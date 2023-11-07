import React,{useEffect} from "react";
import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Orders from "./components/orders/Orders";
import Cart from "./components/Cart/Cart";
import NotFound from "./components/NotFound/NotFound";
import { useSelector, useDispatch } from "react-redux";
import { authSelector, fetchAuthState } from "./redux/authenticationSlice";
import {getInitialState,getCartThunk, getOrdersThunk} from './redux/productsSlice'


function App() {
  const {isLoggedIn, user } = useSelector(authSelector);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getInitialState());
  },[])


  
  useEffect(() => {  
    // console.log('app.js');  
    // console.log(isLoggedIn);  
    dispatch(fetchAuthState());  
    if(isLoggedIn){
      // console.log('app.js', user);
      dispatch(getCartThunk(user));
      dispatch(getOrdersThunk(user));
    }
  },[isLoggedIn]);




  const protect = (element) => {
    if (!isLoggedIn) {
      return <Navigate replace to="/" />;
    } else {
      return element;
    }
  };


  const routes = createRoutesFromElements(
    <Route>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/orders" element={protect(<Orders />)} />
        <Route path="/cart" element={protect(<Cart />)} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (
      <div className="App">
        <RouterProvider router={router} />
        
      </div>
     );
}

export default App;
