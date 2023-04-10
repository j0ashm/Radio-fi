import React from 'react';
import {
  ChakraProvider,
  theme,
  Container
} from '@chakra-ui/react';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container width={'container.md'} centerContent>
        <Header />
        <Body />
        <Footer />
      </Container>
    </ChakraProvider>
  );
}

export default App;
