import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Helper function to load cart from localStorage
const loadCartFromStorage = () =>{
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {products : []};
}

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({userId,guestId},rejectWithValue) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            params: {
                userId,
                guestId
            }
        });
        return response.data; // Return the fetched cart         
    } catch (error) {
        console.error(error);        
        return rejectWithValue(error.response.data);
        
    }
});

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk("cart/addToCart", async ({ productId, quantity, userId, guestId, size , color }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            userId,
            guestId,
            size,
            color,
        });
      console.log(response.data);        
         
        return response.data; // Return the updated cart

    } catch (error) {        
        return rejectWithValue(error.response.data);
    }
});


// update the quantity of an item in the cart for a user or guest
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async ({productId,  quantity, userId, guestId, size,color}, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
            productId,
            quantity,
            guestId,
            userId,
            size,
            color,
        });
        return response.data; // Return the updated cart
    } catch (error) {
               
        return rejectWithValue(error.response.data);
    }
});

// Remove an item from the cart for a user or guest
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({productId, userId, guestId, color,size }, { rejectWithValue }) => {
    try {
        const response = await axios({
            method: "DELETE",
            url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
            data: {
                productId,
                userId,
                guestId,
                color,
                size
            }
        })           
     
        return response.data; // Return the updated cart
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Merge guest cart with user cart
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, {
            userId,
            guestId
        },
        {
            headers : {
                Authorization: `Bearer ${localStorage.getItem("userToken")}`
            }
        }
    );
        return response.data; // Return the merged cart
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const cartSlice = createSlice({
    name : "cart",
    initialState : {
        cart: loadCartFromStorage(),
        loading: false,
        error: null,
    },
    reducers:{
        clearCart: (state) => {
            state.cart = { products: [] };
            localStorage.removeItem("cart");
        },
    },
    extraReducers: (builder) =>{
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled, (state,action) => {
            state.loading = true;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
            
        })
        .addCase(fetchCart.rejected, (state,action) => {
            state.loading = false;
            state.error = action.error.message || "Failed to fetch cart";
        })
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled, (state,action) => {
            state.loading = true;
            state.cart = action.payload;
            // console.log(action.payload);
            
            saveCartToStorage(action.payload);
            
        })
        .addCase(addToCart.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to add to cart";
        })
        .addCase(updateCartItemQuantity.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled, (state,action) => {
            state.loading = true;
            state.cart = action.payload;
            saveCartToStorage(action.payload);            
        })
        .addCase(updateCartItemQuantity.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update item quantity";
        })
        .addCase(removeFromCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(removeFromCart.fulfilled, (state,action) => {
            state.loading = true;
            state.cart = action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(removeFromCart.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to remove item from cart";
        })
        .addCase(mergeCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(mergeCart.fulfilled, (state,action) => {
            state.loading = true;
            state.cart = action.payload;
            saveCartToStorage(action.payload);            
        })
        .addCase(mergeCart.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to merge cart";
        })

    }
})

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
  