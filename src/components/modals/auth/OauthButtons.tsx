import { auth, firestore } from '@/firebase/clientApp'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
// import { User } from 'firebase/auth'
// import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'

const OauthButtons: React.FC = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)

  // Cloud Function alternative for setting user to db

  // const createUserDocument = async (user: User) => {
  //   const userRef = doc(firestore, 'users', user.uid)
  //   await setDoc(userRef, JSON.parse(JSON.stringify(user)))
  // }
  // useEffect(() => {
  //   if (user) createUserDocument(user.user)
  // }, [user])

  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button variant='oauth' mb={2} isLoading={loading} onClick={() => signInWithGoogle()}>
        <Image src='/images/googlelogo.png' alt='google logo' height='20px' mr={4} />
        <Text>Continue with Google</Text>
      </Button>
      <Button variant='oauth' mb={2}>
        <Image src='/images/GitHub.png' alt='github logo' height='26px' mr={4} />
        <Text>Continue with Github</Text>
      </Button>
      <Text>{error?.message}</Text>
    </Flex>
  )
}
export default OauthButtons
