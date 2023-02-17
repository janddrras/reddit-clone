/* eslint-disable react-hooks/exhaustive-deps */
import { Post } from '@/atoms/postsAtom'
import useComments from '@/hooks/useComments'
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react'
import { User } from 'firebase/auth'
import { FC, useEffect, useState } from 'react'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'

type CommentsProps = {
  user?: User | null
  selectedPost: Post
  communityId: string
}

const Comments: FC<CommentsProps> = ({ user }) => {
  const {
    getPostComments,
    onCreateComment,
    onDeleteComment,
    commentText,
    setCommentText,
    comments,
    commentCreateLoading,
    commentFetchLoading,
    deleteLoading
  } = useComments()

  useEffect(() => {
    getPostComments()
  }, [])

  return (
    <Box bg='white' borderRadius='0 0 4px 4px' p={2}>
      <Flex direction='column' pl={10} pr={4} mb={6} fontSize='10pt' width='100%'>
        <CommentInput
          user={user}
          commentText={commentText}
          setCommentText={setCommentText}
          createLoading={commentCreateLoading}
          onCreateComment={onCreateComment}
        />
        <Stack spacing={6} mt={5}>
          {commentFetchLoading ? (
            <>
              {[0, 1, 2].map((item) => (
                <Box key={item} padding='6' bg='white'>
                  <SkeletonCircle size='10' />
                  <SkeletonText mt='4' noOfLines={2} spacing='4' />
                </Box>
              ))}
            </>
          ) : (
            <>
              {!!comments.length ? (
                <>
                  {comments.map((item) => (
                    <CommentItem
                      key={item.id}
                      comment={item}
                      onDeleteComment={onDeleteComment}
                      isLoading={deleteLoading}
                      userId={user?.uid}
                    />
                  ))}
                </>
              ) : (
                <Flex
                  direction='column'
                  justify='center'
                  align='center'
                  borderTop='1px solid'
                  borderColor='gray.100'
                  p={20}
                >
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments Yet
                  </Text>
                </Flex>
              )}
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  )
}
export default Comments
