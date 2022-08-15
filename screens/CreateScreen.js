import { useState } from "react"
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"
import globalStyles from "../globalStyles"
import { MaterialIcons } from "@expo/vector-icons"
import { addDoc, collection } from "firebase/firestore"
import { db, storage } from "../firebase"
import { useAuth } from "../context/AuthContext"
import * as DocumentPicker from "expo-document-picker"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"

const BUTTON_RADIUS = 3
const BUTTON_COLOR = globalStyles.primaryColor

const CreateScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const {
    user: { uid },
  } = useAuth()

  const parentFolder = navigation.router?.params?.parentFolder || null

  const handleCreate = async () => {
    const ref = collection(db, "drive")
    setLoading(true)

    try {
      await addDoc(ref, {
        name,
        userUid: uid,
        parentFolder,
        type: "folder",
      })
      setName("")
      Alert.alert("Success", "Successfully created!")
    } catch {
      alert("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync()
      if (result?.type === "cancel") return

      setLoading(true)
      const file = await fetch(result.uri)
      const blob = await file.blob()

      const storageRef = ref(storage, `user/${uid}/${result.name}`)
      const uploadTask = uploadBytesResumable(storageRef, blob)

      uploadTask.on(
        "state_changed",
        snapshot => {
          const currentProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress(currentProgress)
        },
        e => alert("Something went wrong!"),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref)

          const ref = collection(db, "drive")
          await addDoc(ref, {
            name: result.name,
            type: "file",
            parentFolder,
            url,
            userUid: uid,
          })

          Alert.alert("Success", "Successfully uploaded the file!")

          setLoading(false)
          setProgress(0)
        }
      )
    } catch {
      alert("Something went wrong!")
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        selectionColor={globalStyles.primaryColor}
        onChangeText={setName}
        value={name}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={
            !loading
              ? styles.button
              : {
                  ...styles.button,
                  backgroundColor: globalStyles.disabledButtonColor,
                }
          }
          disabled={loading}
          android_ripple={{ color: "white" }}
          onPress={handleCreate}
        >
          <MaterialIcons name="create-new-folder" size={24} color="white" />
          <Text style={styles.buttonText}>Create</Text>
        </Pressable>
        <Pressable
          android_ripple={{ color: BUTTON_COLOR }}
          disabled={loading}
          style={
            !loading
              ? { ...styles.button, ...styles.outlinedButton }
              : {
                  ...styles.button,
                  ...styles.outlinedButton,
                  backgroundColor:
                    progress < 1 ? globalStyles.disabledButtonColor : "white",
                  borderColor: "transparent",
                }
          }
          onPress={pickFile}
        >
          <MaterialIcons
            name="upload-file"
            size={24}
            color={
              !loading
                ? globalStyles.primaryColor
                : progress > 0
                ? globalStyles.disabledButtonColor
                : "white"
            }
          />
          <Text
            style={{
              ...styles.buttonText,
              color: !loading
                ? globalStyles.primaryColor
                : progress > 0
                ? globalStyles.disabledButtonColor
                : "white",
            }}
          >
            Upload
          </Text>
          <View
            style={{
              ...styles.progressBar,
              width: progress + "%",
              borderTopRightRadius: progress === 100 ? BUTTON_RADIUS : 0,
              borderBottomRightRadius: progress === 100 ? BUTTON_RADIUS : 0,
            }}
          />
        </Pressable>
      </View>
    </View>
  )
}

export default CreateScreen

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 40,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(210, 210, 210, 0.5)",
    borderRadius: 7,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    width: "100%",
    backgroundColor: BUTTON_COLOR,
    borderRadius: BUTTON_RADIUS,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  outlinedButton: {
    backgroundColor: "transparent",
    borderColor: BUTTON_COLOR,
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.7,
    textTransform: "uppercase",
    marginLeft: 7,
    paddingVertical: 10,
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: globalStyles.primaryColor,
    zIndex: -99,
    borderRadius: BUTTON_RADIUS,
  },
})
