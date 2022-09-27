
import { ThemeProvider } from 'styled-components';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import theme from './src/theme';

import { StatusBar } from 'react-native';

import { Loading } from '@components/Loading';

import { Groups } from './src/screens/Groups';
import { NewGroup } from '@screens/NewGroup';
import { Players } from '@screens/Players';

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  });


  return (
    <ThemeProvider
      theme={theme}
    >
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent
      />

      {/* {fontsLoaded ? <Groups /> : <Loading />} */}
      {fontsLoaded ? <Players /> : <Loading />}

    </ThemeProvider>
  );
}
