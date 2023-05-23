import { api } from "../assets/Api" 
import { useEffect, useState, createContext } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export const UserContext = createContext()

export const UserProvider = ({ children }) => {

  const navigate = useNavigate()
  const navigateToLogin = useNavigate("/")
  const navigateToDashboard = useNavigate("/dashboard")
  const userToken = localStorage.getItem("@USER.TOKEN")
  const [loading, setLoading] = useState(false)
  const [loggedUserData, setloggedUserData] = useState(null)
  const [usersTechSkills, setUsersTechSkills] = useState([])

  useEffect(() => {
    
    const autoLogin = async () => {

      if (userToken) {
        try {
          api.defaults.headers.authorization = `Bearer ${userToken}`
          const response = await api.get("/profile")
          setloggedUserData(response.data)
          setUsersTechSkills(response.data.techs)
          navigateToDashboard () 
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      } else if (!userToken) {
        navigateToLogin ()
      }
    }
    autoLogin()
  }, [])

  const userLogin = async (formData) => {

    try {
      setLoading(true)
      const response = await api.post("sessions", formData)
      localStorage.setItem("@USER.TOKEN", response.data.token)
      localStorage.setItem("@USER.ID", response.data.user.id)
      toast.success(
        `${response.data.user.name.toUpperCase().trim()}, seja bem vindo(a)!`
      )
      setloggedUserData(response.data.user)
      setUsersTechSkills(response.data.user.techs)
      setTimeout(() => {
        navigate("/dashboard")
      }, 4000)
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = (even) => {

    even.preventDefault()
    localStorage.removeItem("@USER.TOKEN")
    localStorage.removeItem("@USER.ID")
    toast.success(`${loggedUserData.name.toUpperCase().trim()}, até logo!`)
    setTimeout(() => {
      setloggedUserData(null)
      navigate("/")
    }, 4000)
  }

  const userRegister = async (formData) => {
    
    try {
      setLoading(true)
      const response = await api.post("users", formData)
      if (response) {
          toast.success(`Oi ${response.data.name.toUpperCase()}! Agora faça o seu login.`)
        setTimeout(() => {navigate("/")}, 4000)
      }
    } catch (error) {
      toast.error(error.response)
      console.log(error.response)
      console.log(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider
      value={{
        toast,
        navigate,
        usersTechSkills,
        setUsersTechSkills,
        userToken,
        userLogin,
        logout,
        userRegister,
        loggedUserData,
        setloggedUserData,
        loading,
        setLoading,
        navigateToLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
