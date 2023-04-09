import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import React from 'react'
import { ColorModeSwitcher } from './ColorModeSwitcher'

function Header() {
  return (
    <Flex mt="3" borderBottom={'1px'}>
        <Box p="3">
            <Heading size="lg">Radio-fi</Heading>
        </Box>
        <Spacer ml={50} mr={50}/>
        <ColorModeSwitcher mt={2.5}/>
    </Flex>
  )
}

export default Header