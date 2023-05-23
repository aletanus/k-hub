import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { UserContext } from "../Context/userContext"

export const ProtectedRoutes = () => { 

    const { loggedUserData, loading } = useContext(UserContext)

    if(loading) {
        return null
    }
    return loggedUserData ? (<Outlet/>) : (<Navigate to= "/" replace />)   
}