const FLOATING_ACTION_BUTTON_WIDTH = 60

export default {
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryColor: "dodgerblue",
  transparentTextColor: "rgba(0, 0, 0, 0.8)",
  containerHorizontalMargin: 20,
  disabledButtonColor: "rgba(150, 150, 150, 0.75)",
  floatingActionButtonRippleColor: "rgba(0, 0, 0, 0.3)",
  floatingActionButtonDisabledColor: "lightgray",
  floatingActionButtonStyle: {
    width: FLOATING_ACTION_BUTTON_WIDTH,
    height: FLOATING_ACTION_BUTTON_WIDTH,
    backgroundColor: "white",
    elevation: 8,
    borderRadius: FLOATING_ACTION_BUTTON_WIDTH / 2,
    justifyContent: "center",
    alignItems: "center",
  },
}
