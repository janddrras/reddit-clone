/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { Community, communityState } from '@/atoms/communitiesAtom'
import About from '@/components/community/About'
import CommunityNotFound from '@/components/community/CommunityNotFound'
import CreatePostLink from '@/components/community/CreatePostLink'
import Header from '@/components/community/Header'
import PageContentLayout from '@/components/layout/PageContentLayout'
import Posts from '@/components/posts/Posts'
import { firestore } from '@/firebase/clientApp'
import { doc, getDoc } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import safeJasonStringify from 'safe-json-stringify'

type CommunityPageProps = {
  communityData: Community
}

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState)
  if (!communityData) {
    return <CommunityNotFound />
  }

  useEffect(() => {
    setCommunityStateValue((prev) => ({ ...prev, currentCommunity: communityData }))
  }, [])

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(firestore, 'communities', context.query.communityId as string)
    const communityDoc = await getDoc(communityDocRef)
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(safeJasonStringify({ id: communityDoc.id, ...communityDoc.data() }))
          : ''
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export default CommunityPage
