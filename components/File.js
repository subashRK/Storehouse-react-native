import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
} from "react-native"
import { AntDesign } from "@expo/vector-icons"
import globalStyles from "../globalStyles"
import { useNavigation } from "@react-navigation/native"
import { deleteDoc, doc } from "firebase/firestore"
import { db, storage } from "../firebase"
import { deleteObject, ref } from "firebase/storage"
import { useAuth } from "../context/AuthContext"

const File = ({ refresh, ...file }) => {
  const navigator = useNavigation()
  const iconName = file?.type === "folder" ? "folder1" : "file1"

  const {
    user: { uid },
  } = useAuth()

  const handlePress = async () => {
    if (file?.type === "folder")
      return navigator.push("File", {
        id: file.id,
        name: file.name,
        type: "folder",
      })

    await Linking.openURL(file?.url).catch(() => alert("Something went wrong!"))
  }

  const deleteFile = async () => {
    try {
      const storageRef = ref(storage, `user/${uid}/${file?.name}`)
      deleteObject(storageRef)

      const docRef = doc(db, `drive/${file?.id}`)
      await deleteDoc(docRef)

      refresh()
    } catch {
      alert("Something went wrong!")
    }
  }

  const promptForDelete = () => {
    Alert.alert("Delete", "Do you want to delete this file?", [
      {
        text: "Delete",
        onPress: deleteFile,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.fileContainer}
      onPress={handlePress}
      onLongPress={file?.type === "file" ? promptForDelete : null}
    >
      <AntDesign
        name={iconName}
        size={28}
        color={globalStyles.transparentTextColor}
      />
      <Text numberOfLines={1} style={styles.text}>
        {file?.name}
      </Text>
    </TouchableOpacity>
  )
}

export default File

const styles = StyleSheet.create({
  fileContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    marginVertical: 10,
    marginHorizontal: 5,
    flex: 0.5,
    backgroundColor: "white",
    borderRadius: 5,
    height: 80,
    elevation: 0.7,
  },
  text: {
    flex: 0.6,
    color: globalStyles.transparentTextColor,
  },
})
