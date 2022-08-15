import React from "react"
import {
  TouchableOpacity,
  TextInput,
  Keyboard,
  StyleSheet,
  View,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useRef } from "react"
import globalStyles from "../globalStyles"

const SearchBar = ({ value, setValue }) => {
  const searchInputRef = useRef()

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => searchInputRef.current.focus()}
      style={styles.searchInputContainer}
      onPressOut={Keyboard.dismiss}
    >
      <View pointerEvents="none">
        <MaterialIcons
          name="search"
          size={24}
          color={globalStyles.transparentTextColor}
          style={{ marginLeft: 20 }}
        />
        <TextInput
          selectionColor={globalStyles.primaryColor}
          style={styles.searchInput}
          ref={searchInputRef}
          value={value}
          onChangeText={setValue}
        />
      </View>
    </TouchableOpacity>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  searchInputContainer: {
    position: "relative",
    marginTop: 20,
    backgroundColor: "rgb(230, 230, 230)",
    borderRadius: 50,
    height: 45,
    justifyContent: "center",
    marginBottom: 20,
  },
  searchInput: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    paddingLeft: 50,
    fontSize: 17.5,
    zIndex: -99,
  },
})
