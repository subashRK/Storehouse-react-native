import { createContext, useContext, useState, useEffect } from "react"
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut as signout,
} from "firebase/auth"
import { auth } from "../firebase"

const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    return onAuthStateChanged(auth, user => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const googleSignIn = (idToken, accessToken) => {
    const credentials = GoogleAuthProvider.credential(idToken, accessToken)
    return signInWithCredential(auth, credentials)
  }

  const signOut = () => signout(auth)

  const value = { user, loading, googleSignIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { useAuth, AuthProvider }
