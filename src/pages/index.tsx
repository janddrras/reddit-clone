/* eslint-disable react-hooks/exhaustive-deps */
import { Post } from '@/atoms/postsAtom'
import CreatePostLink from '@/components/community/CreatePostLink'
import PageContentLayout from '@/components/layout/PageContentLayout'
import PostItem from '@/components/posts/PostItem'
import PostLoader from '@/components/posts/PostLoader'
import { auth, firestore } from '@/firebase/clientApp'
import usePosts from '@/hooks/usePosts'
import { Stack } from '@chakra-ui/react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { setPostStateValue, postStateValue, onDeletePost, onSelectPost, onVote } = usePosts()

  const buildUserHomeFeed = () => {}
  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {
      const postQuery = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10))
      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((state) => ({ ...state, posts: posts as Post[] }))
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  const getUserPostVotes = () => {}

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed()
  }, [user, loadingUser])

  return (
    <PageContentLayout>
      <>
        <CreatePostLink />
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
      <></>
    </PageContentLayout>
  )
}

export default Home
