import { Pressable } from "react-native"
import globalStyles from "../globalStyles"
import { Feather } from "@expo/vector-icons"

const RADIUS = globalStyles.floatingActionButtonStyle.width / 2

const LoadMoreButton = ({ onLoadMorePressed, loading }) => {
  return (
    <Pressable
      android_ripple={{
        color: globalStyles.floatingActionButtonRippleColor,
        radius: RADIUS,
      }}
      disabled={loading}
      style={
        loading
          ? {
              ...globalStyles.floatingActionButtonStyle,
              backgroundColor: globalStyles.floatingActionButtonDisabledColor,
            }
          : globalStyles.floatingActionButtonStyle
      }
      onPress={onLoadMorePressed}
    >
      <Feather name="loader" size={RADIUS} color={globalStyles.primaryColor} />
    </Pressable>
  )
}

export default LoadMoreButton
