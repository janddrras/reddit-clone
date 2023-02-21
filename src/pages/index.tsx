/* eslint-disable react-hooks/exhaustive-deps */
import { Post, PostVote } from '@/atoms/postsAtom'
import CreatePostLink from '@/components/community/CreatePostLink'
import PageContentLayout from '@/components/layout/PageContentLayout'
import PostItem from '@/components/posts/PostItem'
import PostLoader from '@/components/posts/PostLoader'
import { auth, firestore } from '@/firebase/clientApp'
import useCommunityData from '@/hooks/useCommunityData'
import usePosts from '@/hooks/usePosts'
import { Stack } from '@chakra-ui/react'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const Home: NextPage = () => {
  const [user, loadingUser] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const { setPostStateValue, postStateValue, onDeletePost, onSelectPost, onVote } = usePosts()
  const { communityStateValue } = useCommunityData()

  const buildUserHomeFeed = async () => {
    setLoading(true)
    try {
      if (communityStateValue.mySnippets.length) {
        const myCommunityIds = communityStateValue.mySnippets.map((snip) => snip.communityId)
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunityIds),
          limit(10)
        )
        const postDocs = await getDocs(postQuery)
        const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setPostStateValue((state) => ({ ...state, posts: posts as Post[] }))
      } else buildNoUserHomeFeed()
    } catch (error) {
      console.log('posts fetching db error', error)
    }
    setLoading(false)
  }
  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {
      const postQuery = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10))
      const postDocs = await getDocs(postQuery)
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((state) => ({ ...state, posts: posts as Post[] }))
    } catch (error) {
      console.log('posts fetching db error', error)
    }
    setLoading(false)
  }
  const getUserPostVotes = async () => {
    setLoading(true)
    try {
      const postIds = postStateValue.posts.map((post) => post.id)
      const postQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds),
        limit(10)
      )
      const postVoteDocs = await getDocs(postQuery)
      const postVotes = postVoteDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setPostStateValue((state) => ({ ...state, postVotes: postVotes as PostVote[] }))
    } catch (error) {
      console.log('posts votes error', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed()
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed()
  }, [user, loadingUser])

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes()
    return () => setPostStateValue((state) => ({ ...state, postVotes: [] }))
  }, [user, postStateValue.posts])

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
                homePage
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
