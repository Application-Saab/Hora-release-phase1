import { ImageBackground, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        marginHorizontal: 18,
        height: 75,
        width: 340,
    },

    contentContainer: {flexDirection:'row',alignItems:"center"},
    contentContainer1: {flexDirection:'column'}, // Set flexDirection to 'row' to align elements horizontally},

    iconImage: {
        width: 69,
        height: 69,
        position:'absolute',
        right: 18, // Position the icon 18 units from the right end of the parent container
          top: 0,
    },

    text: {
        paddingTop:11,
        font: 14,
        color: '#414141',
        marginLeft: 14,
        fontWeight: '600',
        opacity: 0.6,
    },

    textInput: {
        color: '#414',
        fontSize:16,
        fontWeight:'400',
        marginLeft: 15,

    },

    buttonContainer: {
    },

    button: {
        height: 47,
        borderRadius: 6,
        backgroundColor: '#E56352',
        marginHorizontal: 31,
        justifyContent: 'center',
        alignItems: 'center', // Center the button horizontally
        // position: 'absolute', // Position the button absolutely
        bottom: 0, // Align the button to the bottom of the parent container
        left: 0, // Align the button to the left of the parent container
        right: 0,
        marginTop:267 // Align the button to the right of the parent container
      },

    buttonText: {
        textAlign: 'center', // Center the text horizontally
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',

}
}
)

export default styles