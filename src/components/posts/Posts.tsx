/* eslint-disable react-hooks/exhaustive-deps */
import { Community } from '@/atoms/communitiesAtom'
import { Post } from '@/atoms/postsAtom'
import { auth, firestore } from '@/firebase/clientApp'
import usePosts from '@/hooks/usePosts'
import { Stack } from '@chakra-ui/react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import PostItem from './PostItem'
import PostLoader from './PostLoader'

type PostsProps = {
  communityData: Community
}

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { setPostStateValue, postStateValue, onVote, onSelectPost, onDeletePost } = usePosts()

  const getPosts = async () => {
    setLoading(true)
    try {
      const postQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc')
      )
      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((state) => ({ ...state, posts: posts as Post[] }))
    } catch (error: any) {
      console.log('Fetch posts error', error.message)
    }
    setLoading(false)
  }
  useEffect(() => {
    getPosts()
  }, [communityData])

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((item) => (
            <PostItem
              key={item.id}
              post={item}
              userIsCreator={user?.uid === item.creatorId}
              userVoteValue={postStateValue.postVotes.find((vote) => vote.postId === item.id)?.voteValue}
              onDeletePost={onDeletePost}
              onSelectPost={onSelectPost}
              onVote={onVote}
            />
          ))}
        </Stack>
      )}
    </>
  )
}
export default Posts
