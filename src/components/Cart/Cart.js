import { React, useEffect, useState } from "react";
import styles from "./Cart.module.css";
import {
  updateCartThunk,
  placeOrderThunk,
  productSelector,
} from "../../redux/productsSlice";
import { useSelector, useDispatch } from "react-redux";

function Cart() {
  const [total, setTotal] = useState(0);
  const dispatch = useDispatch();
  const { cart, orders } = useSelector(productSelector);

  useEffect(() => {
    if (!cart || !cart.products) return;
    const totalCartPrice = cart.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    setTotal(totalCartPrice);
    // console.log(cart)
  }, [cart]);



  // Define the handleDecreaseQuantity function
  const handleDecreaseQuantity = (index) => {
    // Make sure index is within a valid range
    if (index >= 0 && index < cart.products.length) {
      // Create a shallow copy of the cart and its products
      const updatedProducts = cart.products.map((product, i) => {
        if (i === index) {
          // Create a copy of the product and update its quantity property
          if (product.quantity > 0) {
            // Decrease the quantity if greater than 1
            return {
              ...product,
              quantity: product.quantity - 1,
            };
          }
        }
        return product;
      });

      // Use the filter method to remove products with quantity === 0
      const filteredProducts = updatedProducts.filter(
        (product) => product.quantity > 0
      );

      // Dispatch the action with the updated cart
      dispatch(updateCartThunk({ updatedProducts: filteredProducts, cart }));
    }
  };

  // Define the handleIncreaseQuantity function
  const handleIncreaseQuantity = (index) => {
    // Make sure index is within valid range
    if (index >= 0 && index < cart.products.length) {
      // let updatedProducts = [...cart.products];
      // updatedProducts[index].quantity += 1;
      const updatedProducts = cart.products.map((product, i) => {
        if (i === index) {
          // Create a copy of the product and update its quantity property
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });
      console.log(updatedProducts);
      dispatch(updateCartThunk({ updatedProducts, cart }));
    }
  };

  const placeOrder = () => {
    if (!cart.products || cart.products.length === 0) return;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];

    const order = {
      date: formattedDate,
      products: cart.products,
      total: total,
    };

    dispatch(placeOrderThunk({ order, ordersId: orders.id }));
    dispatch(updateCartThunk({ updatedProducts: [], cart }));
  };

  return (
    <div className={styles.productContainer}>
      <div className={styles.cartHeader}>
        <div className={styles.title}>
          {" "}
          <b>title</b>{" "}
        </div>
        <div className={styles.quantity}>
          {" "}
          <b>quantity</b>
        </div>
        <div className={styles.price}>
          {" "}
          <b>price</b>
        </div>
      </div>
      {cart &&
        cart.products &&
        cart.products.map((product, index) => {
          return (
            <div className={styles.product} key={index}>
              <div className={styles.title}> {product.title} </div>
              <div className={styles.quantity}>
                {" "}
                {product.quantity}
                <div className={styles.quantityButtons}>
                  <button onClick={() => handleDecreaseQuantity(index)}>
                    -
                  </button>
                  <button onClick={() => handleIncreaseQuantity(index)}>
                    +
                  </button>
                </div>
              </div>
              <div className={styles.price}> ₹ {product.price} </div>
            </div>
          );
        })}

      <div className={styles.checkoutContainer}>
        <div className={styles.total}>Total: {total}</div>
        <div onClick={placeOrder} className={styles.placeOrder}>
          Place Order
        </div>
      </div>
    </div>
  );
}

export default Cart;
