import { Button, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

const OauthButtons: React.FC = () => {
  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button variant='oauth' mb={2}>
        <Image src='/images/googlelogo.png' alt='google logo' height='20px' mr={4} />
        <Text>Continue with Google</Text>
      </Button>
    </Flex>
  )
}
export default OauthButtons
