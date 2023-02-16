/* eslint-disable react-hooks/exhaustive-deps */
import { Post } from '@/atoms/postsAtom'
import About from '@/components/community/About'
import PageContentLayout from '@/components/layout/PageContentLayout'
import PostItem from '@/components/posts/PostItem'
import { auth, firestore } from '@/firebase/clientApp'
import useCommunityData from '@/hooks/useCommunityData'
import usePosts from '@/hooks/usePosts'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const PostPage: React.FC = () => {
  const { setPostStateValue, postStateValue, onVote, onDeletePost } = usePosts()
  const [user] = useAuthState(auth)
  const router = useRouter()
  const { communityStateValue } = useCommunityData()

  const fetchPost = async (postId: string) => {
    try {
      const postDocRef = doc(firestore, 'posts', postId)
      const postDoc = await getDoc(postDocRef)
      setPostStateValue((state) => ({
        ...state,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post
      }))
    } catch (error) {
      console.log('fetch single post', error)
    }
  }

  useEffect(() => {
    const { pid } = router.query
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string)
    }
  }, [router.query, postStateValue.selectedPost])

  return (
    <PageContentLayout>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
            userVoteValue={
              postStateValue.postVotes.find((item) => item.postId === postStateValue.selectedPost?.id)
                ?.voteValue
            }
            onDeletePost={onDeletePost}
            onVote={onVote}
          />
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
export default PostPage
