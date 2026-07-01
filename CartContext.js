// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import UserContext from './UserContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const uid = user.id || user.user_id;
          const response = await fetch(`http://127.0.0.1:5000/api/cart/${uid}`);
          const data = await response.json();
          if (Array.isArray(data)) {
            // map product data to expected frontend format
            setCartItems(data.map(item => ({
               ...item,
               id: item.product_id, // map for checkout
               image: item.image_url, // map for cart display
               price: parseFloat(item.price) // parse price to avoid toFixed errors
            })));
          }
        } catch (err) {
          console.error("Error fetching cart", err);
        }
      };
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    
    try {
      const uid = user.id || user.user_id;
      const res = await fetch("http://127.0.0.1:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: uid,
          product_id: product.id,
          quantity: product.quantity || 1
        })
      });
      if (res.ok) {
        // Optimistically update UI
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          if (existingItem) {
            return prevItems.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
            );
          }
          return [...prevItems, { ...product, quantity: product.quantity || 1 }];
        });
      }
    } catch(err) {
      console.error(err);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    // For simplicity, we just update local state if we don't have an update API endpoint.
    // Ideally, we'd hit a PUT /api/cart endpoint here.
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = async (id) => {
    if (!user) return;
    const targetItem = cartItems.find(i => i.id === id);
    if (!targetItem || !targetItem.cart_id) {
       // If no cart_id (optimistic item), just filter it
       setCartItems(prevItems => prevItems.filter(item => item.id !== id));
       return;
    }

    try {
      await fetch("http://127.0.0.1:5000/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart_id: targetItem.cart_id })
      });
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch(err) {
      console.error(err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};