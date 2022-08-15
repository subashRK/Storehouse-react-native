import { createStackNavigator } from "@react-navigation/stack"
import { ActivityIndicator, View } from "react-native"
import { useAuth } from "../context/AuthContext"
import globalStyles from "../globalStyles"
import CreateScreen from "../screens/CreateScreen"
import HomeScreen from "../screens/HomeScreen"
import LoginScreen from "../screens/LoginScreen"
import Drive from "./Drive"

const StackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator()

  const { loading, user } = useAuth()

  return loading ? (
    <View style={globalStyles.center}>
      <ActivityIndicator size="large" color={globalStyles.primaryColor} />
    </View>
  ) : user ? (
    <Navigator
      screenOptions={{
        headerTintColor: globalStyles.transparentTextColor,
        headerShadowVisible: false,
      }}
    >
      <Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Screen
        name="File"
        component={Drive}
        options={({ route }) => ({
          title: route.params?.name || route.params?.type,
        })}
      />
      <Screen
        name="Create"
        component={CreateScreen}
        options={{ presentation: "modal" }}
      />
    </Navigator>
  ) : (
    <LoginScreen />
  )
}

export default StackNavigator
