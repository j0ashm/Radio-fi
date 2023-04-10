import React from 'react'
import { Flex, Box, Spacer, Text, Link, Container } from '@chakra-ui/react'

function Footer() {
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '45%' }}>
        <Flex borderTop={'1px'} mt={5}>
            <Box p={4}>
                <Text>Made with ❤️ in 🇨🇦 by <b><Link href="https://github.com/j0ashm" isExternal>@j0ashm</Link></b></Text>
            </Box>
        </Flex>
    </div>
  )
}

export default Footer