# ReduxCart

Advance Redux demo project

![intro Image](/src/assets/intro.jpg)

## useEffect with Redux

using side effects **(fetch http)** in our code should not do in the reducer function

Async code or useEffect code prefers in Action creators or components

### Trigger for the HTTP request

To fetch http request, need to trigger some state or component in our code.
We can use change of state instead of ADD button or REMOVE button component due to avoid code duplications
Therefore we switch the order

- keep the logic in the reducer (data transform logic)
- First update the Redux Store
- Then select the updated store to send the http request (useEffect)

## Handling Http States & Feedback with Redux

When Edit the Cart (add items or delete items) : send request to backend server to store updated cart on the backend, such that when reloads the frontend application, we can fetch the saved cart from the server loaded and displayed here

- Backend: firebase

```
const response = await fetch(
        "https://reactapp-7f854-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
```

**PUT** method overrides the existing data in the server while **POST** add the data next to existing data

- To prevent initial fetch HTTP request (and override existing data with empty data) due to useEffect behavior: used global variable `let isInitial`
- isInitial is outside of the APP component, hence it only initialize at the app.js file parsed at the begining (page reload).
- Also newly created `showNotification` ui-slice was used to dynamically show the notification status of _pending_, _success_ and _error_ status.

## Action Creator Thunk

By Write our own Action creators

### Thunk:

A function that delays an action until later: can write action creator as a **thunk**.

More explanation on **THUNK**: An action creator function that does `not` return the action itself but another function which eventually returns the action.

- In the component method: always dispatch action creators (functions that returns an action object)
- But action creator method: dispatching a function (here sendCartData) that returns another function
- That returning another function will execute by redux and inside that we can perform side-effects

### dispatch the sendCartData()

```
useEffect(() => {
    if (isInitial) {
      isInitial = false;
      return;
    }

    dispatch(sendCartData(cart));
  }, [cart, dispatch]);
```

### Custom Action creator function

- In JavaScript we can write functions that returns another function

```
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://<API_URL>/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed.");
      }
    };

    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Sent cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Sending cart data failed!",
        })
      );
    }
  };
};

```

![final](/src/assets/final.jpg)
