import AuthModal from '@/components/modals/auth/AuthModal'
import { auth } from '@/firebase/clientApp'
import { Button, Flex } from '@chakra-ui/react'
import { signOut, User } from 'firebase/auth'
import React from 'react'
import AuthButtons from './AuthButtons'
import Icons from './Icons'
import UserMenu from './UserMenu'

type RightContentProps = {
  user?: User | null
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex align='center' justify='center'>
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  )
}
export default RightContent
