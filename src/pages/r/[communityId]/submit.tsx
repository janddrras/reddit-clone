import { communityState } from '@/atoms/communitiesAtom'
import PageContentLayout from '@/components/layout/PageContentLayout'
import NewPostForm from '@/components/posts/PostForm/NewPostForm'
import { auth } from '@/firebase/clientApp'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState } from 'recoil'

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth)
  const communityStateValue = useRecoilState(communityState)

  return (
    <PageContentLayout>
      <>
        <Box p='14px 0' borderBottom='1px solid' borderColor='white'>
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <>
        <div>About</div>
      </>
    </PageContentLayout>
  )
}
export default SubmitPostPage
