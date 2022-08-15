import { Pressable } from "react-native"
import globalStyles from "../globalStyles"
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const RADIUS = globalStyles.floatingActionButtonStyle.width / 2

const CreateNewButton = ({ parentFolder }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    navigation.navigate("Create", { parentFolder })
  }

  return (
    <Pressable
      android_ripple={{
        color: globalStyles.floatingActionButtonRippleColor,
        radius: RADIUS,
      }}
      style={{
        marginLeft: 7,
        ...globalStyles.floatingActionButtonStyle,
      }}
      onPress={handlePress}
    >
      <MaterialIcons
        name="add"
        size={RADIUS}
        color={globalStyles.primaryColor}
      />
    </Pressable>
  )
}

export default CreateNewButton
