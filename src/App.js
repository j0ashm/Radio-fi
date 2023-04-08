import React from 'react';
import {
  ChakraProvider,
  theme,
  Container
} from '@chakra-ui/react';
import Header from './components/Header';
import Body from './components/Body';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Container width={'container.md'} centerContent>
        <Header />
        <Body />
      </Container>
    </ChakraProvider>
  );
}

export default App;
