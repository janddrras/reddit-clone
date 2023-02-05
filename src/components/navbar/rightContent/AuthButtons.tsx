import React from 'react'
import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import { AuthModalState, authModalState } from '@/atoms/authModalAtom'

const AuthButtons: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState)
  const openModal = (view: AuthModalState['view']) => {
    setAuthModalState({ open: true, view: view })
  }
  return (
    <>
      <Button
        variant={'outline'}
        height='28px'
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => openModal('login')}
      >
        Log In
      </Button>
      <Button
        height='28px'
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => openModal('signup')}
      >
        Sign Up
      </Button>
    </>
  )
}
export default AuthButtons
