import CreateCommunityModal from '@/components/modals/community/CreateCommunityModal'
import { Flex, MenuItem, Text, Icon } from '@chakra-ui/react'
import React, { useState } from 'react'
import { GrAdd } from 'react-icons/gr'

type CommunitiesProps = {}

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <MenuItem width='100%' _hover={{ bg: 'blue.500', color: 'white' }} onClick={() => setOpen(true)}>
        <Flex align='center'>
          <Icon as={GrAdd} fontSize={20} mr={3} />
          <Text fontSize='10pt'>Create Community</Text>
        </Flex>
      </MenuItem>
    </>
  )
}
export default Communities
