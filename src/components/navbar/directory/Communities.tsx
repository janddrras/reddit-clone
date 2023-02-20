import { communityState } from '@/atoms/communitiesAtom'
import CreateCommunityModal from '@/components/modals/community/CreateCommunityModal'
import { Flex, MenuItem, Text, Icon, Box } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaReddit } from 'react-icons/fa'
import { GrAdd } from 'react-icons/gr'
import { useRecoilValue } from 'recoil'
import MenuListItem from './MenuListItem'

type CommunitiesProps = {}

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false)
  const mySnippets = useRecoilValue(communityState).mySnippets

  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text mb={1} fontSize='7pt' fontWeight={500} color='gray.500' textAlign='center'>
          Moderating
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor='red'
              imageURL={snippet.imageUrl}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text mb={1} fontSize='7pt' fontWeight={500} color='gray.500' textAlign='center'>
          My Communities
        </Text>
        <MenuItem width='100%' _hover={{ bg: 'blue.500', color: 'white' }} onClick={() => setOpen(true)}>
          <Flex align='center'>
            <Icon as={GrAdd} fontSize={20} mr={3} />
            <Text fontSize='10pt'>Create Community</Text>
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor='blue.500'
            imageURL={snippet.imageUrl}
          />
        ))}
      </Box>
    </>
  )
}
export default Communities
