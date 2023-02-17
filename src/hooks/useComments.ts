/* eslint-disable react-hooks/exhaustive-deps */
import { authModalState } from '@/atoms/authModalAtom'
import { postState, Post } from '@/atoms/postsAtom'
import { auth, firestore } from '@/firebase/clientApp'
import {
  writeBatch,
  doc,
  collection,
  serverTimestamp,
  increment,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { useState, useCallback } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSetRecoilState } from 'recoil'
import { Comment } from '@/components/posts/comments/CommentItem'
import useCommunityData from './useCommunityData'
import usePosts from './usePosts'

const useComments = () => {
  const [user] = useAuthState(auth)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [commentFetchLoading, setCommentFetchLoading] = useState(false)
  const [commentCreateLoading, setCommentCreateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const setAuthModalState = useSetRecoilState(authModalState)
  const setPostState = useSetRecoilState(postState)
  const { postStateValue, onVote } = usePosts()
  const { communityStateValue } = useCommunityData()

  const onCreateComment = async () => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' })
      return
    }

    setCommentCreateLoading(true)
    try {
      const batch = writeBatch(firestore)

      // Create comment document
      const commentDocRef = doc(collection(firestore, 'comments'))
      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split('@')[0],
        postId: postStateValue.selectedPost?.id!,
        creatorPhotoURL: user.photoURL as string,
        communityId: communityStateValue.currentCommunity?.id!,
        text: commentText,
        postTitle: postStateValue.selectedPost?.title!,
        createdAt: serverTimestamp() as Timestamp
      }
      batch.set(commentDocRef, newComment)

      // Update post numberOfComments
      batch.update(doc(firestore, 'posts', postStateValue.selectedPost?.id as string), {
        numberOfComments: increment(1)
      })
      await batch.commit()

      setCommentText('')
      setComments((prev) => [newComment, ...prev])

      // Fetch posts again to update number of comments
      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1
        } as Post
      }))
    } catch (error: any) {
      console.log('onCreateComment error', error.message)
    }
    setCommentCreateLoading(false)
  }

  const onDeleteComment = useCallback(
    async (comment: Comment) => {
      setDeleteLoading(true)
      try {
        if (!comment.id) throw 'Comment has no ID'
        const batch = writeBatch(firestore)
        const commentDocRef = doc(firestore, 'comments', comment.id)
        batch.delete(commentDocRef)

        batch.update(doc(firestore, 'posts', comment.postId), {
          numberOfComments: increment(-1)
        })

        await batch.commit()

        setPostState((prev) => ({
          ...prev,
          selectedPost: {
            ...prev.selectedPost,
            numberOfComments: prev.selectedPost?.numberOfComments! - 1
          } as Post
        }))

        setComments((prev) => prev.filter((item) => item.id !== comment.id))
      } catch (error: any) {
        console.log('Error deletig comment', error.message)
      }
      setDeleteLoading(false)
    },
    [setComments, setPostState]
  )

  const getPostComments = async () => {
    setCommentFetchLoading(true)
    try {
      const commentsQuery = query(
        collection(firestore, 'comments'),
        where('postId', '==', postStateValue.selectedPost?.id),
        orderBy('createdAt', 'desc')
      )
      const commentDocs = await getDocs(commentsQuery)
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setComments(comments as Comment[])
    } catch (error: any) {
      console.log('getPostComments error', error.message)
    }
    setCommentFetchLoading(false)
  }

  return {
    getPostComments,
    onCreateComment,
    onDeleteComment,
    commentText,
    setCommentText,
    comments,
    commentCreateLoading,
    commentFetchLoading,
    deleteLoading
  }
}

export default useComments
