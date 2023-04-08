import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'
import React from 'react'

function Header() {
  return (
    <Flex mt="3" borderBottom={'1px'}>
        <Box p="3">
            <Heading size="lg">Radio-fi</Heading>
        </Box>
        <Spacer />
    </Flex>
  )
}

export default Header