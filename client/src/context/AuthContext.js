import { createContext, useReducer, useEffect } from "react"

// set the initial state, if not already set then make it null other wise get the item saved in localstorage
const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
};

// this function is used to create the context
export const AuthContext = createContext(INITIAL_STATE)

const AuthReducer = (state, action) => {
    switch (action.type) {

        // if no login then initially everything is null
        case "LOGIN_START":
            return {
                user: null,
                loading: true,
                error: null
            };
        
        // once login is successful, set the user object to action.payload
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                error: null
            };
        
        // if login fails set the error to action.payload
        case "LOGIN_FAILURE":
            return {
                user: null,
                loading: false,
                error: action.payload
            };
        
        // if user logs out set the user object to null
        case "LOGOUT":
            return {
                user: null,
                loading: false,
                error: null
            };
        default:
            return state;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    // save the state of the user in local storage
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])


    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                loading: state.loading,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}