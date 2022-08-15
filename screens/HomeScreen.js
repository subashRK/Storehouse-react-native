import { SafeAreaView, StatusBar, StyleSheet } from "react-native"
import Drive from "../components/Drive"
import HomeHeader from "../components/HomeHeader"

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <Drive />
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight + 25,
  },
})
