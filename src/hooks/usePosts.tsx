/* eslint-disable react-hooks/exhaustive-deps */
import { authModalState } from '@/atoms/authModalAtom'
import { communityState } from '@/atoms/communitiesAtom'
import { Post, postState, PostVote } from '@/atoms/postsAtom'
import { auth, firestore, storage } from '@/firebase/clientApp'
import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const usePosts = () => {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [postStateValue, setPostStateValue] = useRecoilState(postState)
  const currentCommunity = useRecoilValue(communityState).currentCommunity
  const setAuthModalState = useSetRecoilState(authModalState)

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    event.stopPropagation()
    if (!user?.uid) {
      setAuthModalState({ open: true, view: 'login' })
      return
    }

    const { voteStatus } = post
    const existingVote = postStateValue.postVotes.find((vote) => vote.postId === post.id)
    try {
      const batch = writeBatch(firestore)
      let updatedPost = { ...post }
      let updatedPosts = [...postStateValue.posts]
      let updatedPostVotes = [...postStateValue.postVotes]
      let voteChange = vote

      if (!existingVote) {
        const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`))
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId: communityId,
          voteValue: vote
        }
        batch.set(postVoteRef, newVote)
        updatedPost.voteStatus = voteStatus + vote
        updatedPostVotes = [...updatedPostVotes, newVote]
      } else {
        const postVoteRef = doc(firestore, 'users', `${user?.uid}/postVotes/${existingVote.id}`)
        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus = voteStatus - vote
          updatedPostVotes = updatedPostVotes.filter((vote) => vote.id !== existingVote.id)
          batch.delete(postVoteRef)
          voteChange *= -1
        } else {
          updatedPost.voteStatus = voteStatus + 2 * vote
          const voteIdx = postStateValue.postVotes.findIndex((vote) => vote.id === existingVote.id)
          updatedPostVotes[voteIdx] = { ...existingVote, voteValue: vote }
          batch.update(postVoteRef, { voteValue: vote })
          voteChange = 2 * vote
        }
      }

      if (postStateValue.selectedPost) {
        setPostStateValue((state) => ({ ...state, selectedPost: updatedPost }))
      }
      // update firestore
      const postRef = doc(firestore, 'posts', post.id!)
      batch.update(postRef, { voteStatus: voteStatus + voteChange })
      await batch.commit()
      // update state
      const postIdx = postStateValue.posts.findIndex((item) => item.id === post.id)
      updatedPosts[postIdx] = updatedPost
      setPostStateValue((state) => ({ ...state, posts: updatedPosts, postVotes: updatedPostVotes }))
    } catch (error) {
      console.log('voting error', error)
    }
  }

  const onSelectPost = (post: Post) => {
    setPostStateValue((state) => ({ ...state, selectedPost: post }))
    router.push(`/r/${post.communityId}/comments/${post.id}`)
  }

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      if (post.imgUrl) {
        const imgRef = ref(storage, `posts/${post.id}/image`)
        await deleteObject(imgRef)
      }
      const postDocRef = doc(firestore, 'posts', post.id!)
      await deleteDoc(postDocRef)
      setPostStateValue((state) => ({ ...state, posts: state.posts.filter((item) => item.id !== post.id) }))
      return true
    } catch (error) {
      return false
    }
  }

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, 'users', `${user?.uid}/postVotes`),
      where('communityId', '==', communityId)
    )
    const postVoteDocs = getDocs(postVotesQuery)
    const postVotes = (await postVoteDocs).docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setPostStateValue((state) => ({ ...state, postVotes: postVotes as PostVote[] }))
  }
  useEffect(() => {
    if (!user || !currentCommunity) return
    getCommunityPostVotes(currentCommunity?.id)
  }, [user, currentCommunity])

  useEffect(() => {
    if (!user) {
      setPostStateValue((state) => ({ ...state, postVotes: [] }))
    }
  }, [user])

  return { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost }
}
export default usePosts
