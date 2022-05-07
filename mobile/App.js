import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      style={{ marginTop: '10%' }}
      source={{
        uri: 'https://infinite-shore-03982.herokuapp.com/'
      }}
      renderError={() => alert('Could not render view.', 'Render Error')}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
