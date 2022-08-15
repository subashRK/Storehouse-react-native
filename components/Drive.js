import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
  startAt,
  where,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import { db } from "../firebase"
import globalStyles from "../globalStyles"
import File from "./File"
import SearchBar from "../components/SearchBar"
import LoadMoreButton from "./LoadMoreButton"
import CreateNewButton from "./CreateNewButton"

const DOCS_QUERY_LIMIT = 15

const Drive = props => {
  const [refreshing, setRefreshing] = useState(false)
  const [files, setFiles] = useState(null)
  const [lastFile, setLastFile] = useState(null)
  const [search, setSearch] = useState("")
  const [loadingNewFiles, setLoadingNewFiles] = useState(false)

  const {
    user: { uid },
  } = useAuth()
  const folder = props.folder || props.route?.params?.id || null
  const searchedFiles =
    files?.filter(file =>
      file?.name?.trim()?.toLowerCase().includes(search.trim().toLowerCase())
    ) || []
  const ref = collection(db, "drive")
  const queries = [
    where("userUid", "==", uid),
    where("parentFolder", "==", folder),
  ]

  const getQuery = (snapQuery, successCallback, notInitialQuery) => {
    getDocs(snapQuery)
      .then(snapshot => {
        if (snapshot.docs.length)
          setLastFile(snapshot?.docs?.[snapshot.docs.length - 1])
        setFiles(
          notInitialQuery
            ? oldFiles => [
                ...oldFiles,
                ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
              ]
            : [...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))]
        )
        successCallback && successCallback()
      })
      .catch(() => alert("Something went wrong!"))
  }

  useEffect(() => {
    const snapQuery = query(ref, ...queries, limit(DOCS_QUERY_LIMIT))
    getQuery(snapQuery)
  }, [folder])

  const onRefresh = () => {
    setRefreshing(true)
    const snapQuery = query(ref, ...queries, limit(files?.length))
    getQuery(snapQuery, () => setRefreshing(false))
  }

  const onLoadMorePressed = () => {
    setLoadingNewFiles(true)

    const snapQuery =
      lastFile != null
        ? query(ref, ...queries, startAfter(lastFile), limit(DOCS_QUERY_LIMIT))
        : query(ref, ...queries, limit(DOCS_QUERY_LIMIT))

    getQuery(snapQuery, () => setLoadingNewFiles(false), true)
  }

  const renderItem = ({ item }) => <File {...item} refresh={onRefresh} />

  return files == null ? (
    <View style={globalStyles.center}>
      <ActivityIndicator size="large" color={globalStyles.primaryColor} />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <SearchBar value={search} setValue={setSearch} />
      <FlatList
        data={searchedFiles}
        renderItem={renderItem}
        keyExtractor={file => file.id}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.floatingActionButtons}>
        <LoadMoreButton
          onLoadMorePressed={onLoadMorePressed}
          loading={loadingNewFiles}
        />
        <CreateNewButton parentFolder={folder} />
      </View>
    </SafeAreaView>
  )
}

export default Drive

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginHorizontal: globalStyles.containerHorizontalMargin,
  },
  floatingActionButtons: {
    position: "absolute",
    right: 20,
    bottom: 30,
    flexDirection: "row",
  },
})
