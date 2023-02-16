/* eslint-disable react-hooks/exhaustive-deps */
import { authModalState } from '@/atoms/authModalAtom'
import { Community, CommunitySnippet, communityState } from '@/atoms/communitiesAtom'
import { auth, firestore } from '@/firebase/clientApp'
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useSetRecoilState } from 'recoil'

const useCommunityData = () => {
  const [user] = useAuthState(auth)
  const setAuthModalState = useSetRecoilState(authModalState)
  const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const getMySnippets = async () => {
    try {
      setLoading(true)
      const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`))
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }))
      setCommunityStateValue((state) => ({ ...state, mySnippets: snippets as CommunitySnippet[] }))
    } catch (error: any) {
      console.log('fetching error', error)
      setError(error.message)
    }
    setLoading(false)
  }

  const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
    if (!user) {
      setAuthModalState({ open: true, view: 'login' })
      return
    }
    setLoading(true)
    if (isJoined) {
      leaveCommunity(communityData.id)
      return
    }
    joinCommunity(communityData)
  }

  const joinCommunity = async (communityData: Community) => {
    try {
      const batch = writeBatch(firestore)
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageUrl: communityData.imageUrl || ''
      }
      batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet)
      batch.update(doc(firestore, 'communities', communityData.id), { numberOfMembers: increment(1) })
      await batch.commit()
      setCommunityStateValue((state) => ({ ...state, mySnippets: [...state.mySnippets, newSnippet] }))
    } catch (error: any) {
      console.log('join community error', error)
      setError(error.message)
    }
    setLoading(false)
  }
  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore)

      batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId))
      batch.update(doc(firestore, 'communities', communityId), { numberOfMembers: increment(-1) })
      await batch.commit()
      setCommunityStateValue((state) => ({
        ...state,
        mySnippets: state.mySnippets.filter((item) => item.communityId !== communityId)
      }))
    } catch (error: any) {
      console.log('leave community error', error)
      setError(error.message)
    }
    setLoading(false)
  }

  const getCommunityData = async (communityId: string) => {
    try {
      const communityDocRef = doc(firestore, 'communities', communityId)
      const communityDoc = await getDoc(communityDocRef)
      setCommunityStateValue((state) => ({
        ...state,
        currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community
      }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((state) => ({ ...state, mySnippets: [] }))
      return
    }
    getMySnippets()
  }, [user])

  useEffect(() => {
    const { communityId } = router.query
    if (communityId && !communityStateValue.currentCommunity) {
      getCommunityData(communityId as string)
    }
  }, [router.query, communityStateValue.currentCommunity])

  return { communityStateValue, onJoinOrLeaveCommunity, loading, error }
}

export default useCommunityData
