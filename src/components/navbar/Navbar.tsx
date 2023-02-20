import React from 'react'
import { Flex, Image } from '@chakra-ui/react'
import SearchInput from './SearchInput'
import RightContent from './rightContent/RightContent'
import Directory from './directory/Directory'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/firebase/clientApp'
import useDirectory from '@/hooks/useDirectory'
import { defaultMenuItem } from '@/atoms/directoryMenuAtom'

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth)
  const { onSelectMenuItem } = useDirectory()

  return (
    <Flex bg='white' height='44px' padding='6px 12px' justify={{ md: 'space-between' }}>
      <Flex
        align='center'
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: '0', md: '2' }}
        onClick={() => onSelectMenuItem(defaultMenuItem)}
        cursor='pointer'
      >
        <Image src='/images/redditFace.svg' alt='reddit logo' height='30px' />
        <Image
          src='/images/redditText.svg'
          alt='reddit text'
          height='46px'
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  )
}

export default Navbar
