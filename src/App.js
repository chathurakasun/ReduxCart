import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useEffect, Fragment } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

// at the begining , empty cart data is sending due to useEffect behavior, it will override existing cart data with empty data when reloads
let isInitial = true;

// isInitial won't not initialize again for component re-rendering , its outside of the component function,
// initialize when the file is parsed for the first time(page reload)
function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  //set few dispatches for notification handling
  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "sending...",
          message: "Sending cart data!",
        })
      );
      const response = await fetch(
        "https://reactapp-7f854-default-rtdb.firebaseio.com/cart",
        {
          // put and post, put overrides existing data
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
      if (!response.ok) {
        throw new Error("something wrong");
      }
      // const responseData = await response.json(); for the put , we really don't care about the data
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success...",
          message: "Sent cart data successfully!",
        })
      );
    };
    // prevent first time data send when page reloads
    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error...",
          message: "Sending cart data FAILED!",
        })
      );
    });
  }, [cart, dispatch]); // weather we add dispatch for complete sake, dispatch fn will never change!!!
  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
