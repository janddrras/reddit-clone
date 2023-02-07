import { authModalState } from '@/atoms/authModalAtom'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import { FIREBASE_ERRORS } from '@/firebase/errors'

type LoginProps = {}

const Login: React.FC<LoginProps> = () => {
  const [signUpForm, setSignUpForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const setAuthModalState = useSetRecoilState(authModalState)
  const [createUserWithEmailAndPassword, user, loading, userError] = useCreateUserWithEmailAndPassword(auth)
  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
  }
  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
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
      <Input
        required
        name='confirmPassword'
        type='password'
        placeholder='confirm password'
        mb={2}
        bg='grey.50'
        fontSize='10pt'
        _placeholder={{ color: 'grey.500' }}
        _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
        _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.500', outline: 'none' }}
        onChange={inputChange}
      />
      <Text textAlign='center' color='red' fontSize='10pt'>
        {error || FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
      <Button width='100%' height='36px' mt='2' mb='2' type='submit' isLoading={loading}>
        Sign Up
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>Allready member?</Text>
        <Text
          color='blue.500'
          fontWeight='700'
          cursor='pointer'
          onClick={() => setAuthModalState((prev) => ({ ...prev, view: 'login' }))}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  )
}
export default Login
