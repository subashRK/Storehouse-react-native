import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import globalStyles from "../globalStyles"

const HomeHeader = () => {
  const { user, signOut } = useAuth()

  const promptForLogout = () => {
    Alert.alert("Logout", "Would you like to log out?", [
      {
        text: "Logout",
        onPress: signOut,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Home</Text>
      <TouchableOpacity activeOpacity={0.6} onPress={promptForLogout}>
        <Image source={{ uri: user.photoURL }} style={styles.profilePicture} />
      </TouchableOpacity>
    </View>
  )
}

export default HomeHeader

const PROFILE_PICTURE_SIZE = 35

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: globalStyles.containerHorizontalMargin,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: globalStyles.transparentTextColor,
  },
  profilePicture: {
    width: PROFILE_PICTURE_SIZE,
    height: PROFILE_PICTURE_SIZE,
    borderRadius: PROFILE_PICTURE_SIZE / 2,
    resizeMode: "cover",
  },
})
