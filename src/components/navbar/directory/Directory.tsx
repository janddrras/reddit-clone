import useDirectory from '@/hooks/useDirectory'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Menu, MenuButton, MenuList, Icon, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { TiHome } from 'react-icons/ti'
import Communities from './Communities'

const UserMenu: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory()
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        onClick={toggleMenuOpen}
      >
        <Flex align='center' justify='space-between' width={{ base: 'auto', lg: '200px' }}>
          <Flex
            align='center'
            mr={1.5}
            ml={1.5}
            padding={1}
            cursor='pointer'
            borderRadius={4}
            _hover={{ bg: 'gray.200' }}
          >
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                borderRadius='full'
                boxSize='18px'
                src={directoryState.selectedMenuItem.imageURL}
                mr={2}
                alt=''
              />
            ) : (
              <Icon
                as={directoryState.selectedMenuItem.icon}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                color={directoryState.selectedMenuItem.iconColor}
              />
            )}
            <Flex display={{ base: 'none', md: 'flex' }}>
              <Text fontWeight={600} fontSize='10pt'>
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color='gray.400' />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  )
}
export default UserMenu
