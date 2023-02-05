import { authModalState } from '@/atoms/authModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'

type LoginProps = {}

const Login: React.FC<LoginProps> = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const setAuthModalState = useSetRecoilState(authModalState)
  const submitForm = () => {}
  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }
  return (
    <form onSubmit={submitForm}>
      <Input
        required
        name='email'
        type='email'
        placeholder='email'
        mb={2}
        bg='grey.50'
        fontSize='10pt'
        _placeholder={{ color: 'grey.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.500', outline: 'none' }}
        onChange={inputChange}
      />
      <Input
        required
        name='password'
        type='password'
        placeholder='password'
        mb={2}
        bg='grey.50'
        fontSize='10pt'
        _placeholder={{ color: 'grey.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.500', outline: 'none' }}
        onChange={inputChange}
      />
      <Button width='100%' height='36px' mt='2' mb='2' type='submit'>
        Log In
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>New here?</Text>
        <Text
          color='blue.500'
          fontWeight='700'
          cursor='pointer'
          onClick={() => setAuthModalState((prev) => ({ ...prev, view: 'signup' }))}
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  )
}
export default Login
