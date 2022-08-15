import { Pressable, StyleSheet, Text, View } from "react-native"
import { IOS_CLIENT_ID, ANDROID_CLIENT_ID, EXPO_CLIENT_ID } from "../secrets"
import { useAuthRequest as useGoogleAuthRequest } from "expo-auth-session/providers/google"
import globalStyles from "../globalStyles"
import { useAuth } from "../context/AuthContext"
import { FontAwesome } from "@expo/vector-icons"
import { maybeCompleteAuthSession } from "expo-web-browser"
import { useEffect, useState } from "react"

const GOOGLE_COLOR = "#DB4437"

maybeCompleteAuthSession()

const LoginScreen = () => {
  const [_, response, promptAsync] = useGoogleAuthRequest({
    androidClientId: ANDROID_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    expoClientId: EXPO_CLIENT_ID,
  })
  const [loading, setLoading] = useState(false)

  const { googleSignIn } = useAuth()

  useEffect(() => {
    if (!response) return

    if (response.type === "success") {
      setLoading(true)
      const { idToken, accessToken } = response.authentication
      googleSignIn(idToken, accessToken).catch(e => alert(e.message))
    } else {
      setLoading(false)
      alert("Something went wrong!")
    }
  }, [response])

  return (
    <View style={{ ...globalStyles.center, flexDirection: "row" }}>
      <Pressable
        style={{
          ...styles.button,
          borderColor: loading
            ? globalStyles.disabledButtonColor
            : GOOGLE_COLOR,
        }}
        android_ripple={{ color: GOOGLE_COLOR }}
        onPress={() => {
          setLoading(true)
          promptAsync()
        }}
        disabled={loading}
      >
        <FontAwesome
          style={{ marginRight: 10 }}
          name="google"
          size={24}
          color={loading ? globalStyles.disabledButtonColor : GOOGLE_COLOR}
        />
        <Text
          style={{
            ...styles.text,
            color: loading ? globalStyles.disabledButtonColor : GOOGLE_COLOR,
          }}
        >
          Sign in via Google
        </Text>
      </Pressable>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  button: {
    borderWidth: 0.5,
    borderRadius: 3,
    borderStyle: "solid",
    paddingHorizontal: 25,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: 16,
  },
})
