import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	container: {
	  paddingTop: 30,
	  justifyContent: 'flex-start',
	  alignItems: 'center',
	},
	inputContainer: {
	  flexDirection: 'row',
	  justifyContent: 'space-between',
	  alignItems: 'center',
	  width: '100%'
	},
	loginContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	loginImageBlock: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	placeInput: {
	  width: '70%'
	},
	placeButton: {
	  width: '30%'
	},
	listContainer: {
	  width: '100%'
	},
	loginButton: {
		backgroundColor: '#281483',
	},
	whiteText: {
		color: '#fff'
	},
	loginAvatar: {
		alignItems: 'center'
	},
	beforePicsContainer:{
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	afterPicsContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	attachmentPicsContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	imageBox: {
		position: 'relative',
		display: 'flex'
	},
	imageBoxCloseBtn: {
		position: 'absolute',
		right: '3%',
		top: '3.5%',
		// borderRadius: 50,
	},
	offlineContainer: {
		backgroundColor: '#b52424',
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'relative',
		top: 1,
		zIndex: 99999	
	  },
	offlineText: { 
		color: '#fff'
	},
	jobcardEditContainer: {
		paddingLeft: 10,
		paddingRight:10,
		marginBottom: 5
	}
  });