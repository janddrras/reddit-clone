import { communityState } from '@/atoms/communitiesAtom'
import About from '@/components/community/About'
import PageContentLayout from '@/components/layout/PageContentLayout'
import NewPostForm from '@/components/posts/PostForm/NewPostForm'
import { auth } from '@/firebase/clientApp'
import useCommunityData from '@/hooks/useCommunityData'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth)
  const { communityStateValue } = useCommunityData()

  return (
    <PageContentLayout>
      <>
        <Box p='14px 0' borderBottom='1px solid' borderColor='white'>
          <Text>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm user={user} communityImageUrl={communityStateValue.currentCommunity?.imageUrl} />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContentLayout>
  )
}
export default SubmitPostPage
