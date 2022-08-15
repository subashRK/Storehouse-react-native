import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import StackNavigator from "./components/StackNavigator"
import { AuthProvider } from "./context/AuthContext"

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar translucent={true} />
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
