import React from 'react'
import { Flex, Image } from '@chakra-ui/react'
import SearchInput from './SearchInput'
import RightContent from './rightContent/RightContent'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth)

  return (
    <Flex bg='white' height='44px' padding='6px 12px'>
      <Flex align='center' width='100%'>
        <Image src='/images/redditFace.svg' alt='reddit logo' height='30px' />
        <Image
          src='/images/redditText.svg'
          alt='reddit text'
          height='46px'
          display={{ base: 'none', md: 'unset' }}
        />
        <SearchInput user={user} />
        <RightContent user={user} />
      </Flex>
    </Flex>
  )
}

export default Navbar
