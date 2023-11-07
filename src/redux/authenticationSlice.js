import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {toast} from 'react-toastify';


const initialState = {
  isLoggedIn: false,
  user: null,
  loading: false,
};



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(signUpUser.pending, (state, action) => {
        console.log("signUpUser pending");
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        if(action.payload){
          state.user = action.payload;
        state.isLoggedIn = true;
        } 
      })
      .addCase(logOutUser.pending, (state, action) => {
        console.log("logout pending");
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});



// Create an async thunk to fetch the authentication state
export const fetchAuthState = createAsyncThunk(
  "auth/fetchAuthState",
  async () => {
    const auth = getAuth();
    return new Promise((resolve) => {
      // Use Firebase's onAuthStateChanged to listen for user changes
      // user passed is done by firebase from local storage
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          user = {
            uid: user.uid,
            email: user.email,
          };
          resolve({
            user,
            isLoggedIn: true,
          });
        } else {
          resolve({
            user: null,
            isLoggedIn: false,
          });
        }
        unsubscribe();
      });
    });
  }
);



// Create an async thunk to  authenticate user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const { email, password } = userData;
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        // Add other properties you need in a serializable format
      };
      toast.success("Login Successful");

      thunkAPI.dispatch(actions.setLogin(serializableUser));
    } catch (error) {
      toast.error(error.code);
    }
  }
);



// Create an async thunk to  authenticate user
export const signUpUser = createAsyncThunk(
  "auth/signUp",
  async (userData, thunkAPI) => {
    try {
      const { email, password } = userData;
      console.log(email, password);
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      // Create a serializable user object
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        // Add other properties you need in a serializable format
      };
      toast.success("Sign Up Successful");
      return serializableUser;
    } catch (error) {
      toast.error(error.code);
    } 
  }
);



// Create an async log out authenticated user
export const logOutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    try {
      const auth = getAuth();
      signOut(auth);
      toast.success("Logout Successful");
    } catch (error) {
      toast.error(error.code);
    }
  }
);


export const authReducer = authSlice.reducer;

export const actions = authSlice.actions;

// selector
export const authSelector = (state) => state.authReducer;
