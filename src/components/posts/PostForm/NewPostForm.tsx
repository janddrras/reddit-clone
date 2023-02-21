import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { BiPoll } from 'react-icons/bi'
import { BsLink45Deg, BsMic } from 'react-icons/bs'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5'
import TabItem from './TabItem'
import TextInputs from './TextInputs'
import ImageUpload from './ImageUpload'
import { User } from 'firebase/auth'
import { useRouter } from 'next/router'
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { firestore, storage } from '@/firebase/clientApp'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import useSelectFile from '@/hooks/useSelectFile'

type NewPostFormProps = {
  user: User
  communityImageUrl?: string
}

export type TabItemType = {
  title: string
  icon: typeof Icon.arguments
}

const FORM_TABS: Array<TabItemType> = [
  {
    title: 'Post',
    icon: IoDocumentText
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline
  },
  {
    title: 'Link',
    icon: BsLink45Deg
  },
  {
    title: 'Poll',
    icon: BiPoll
  },
  {
    title: 'Talk',
    icon: BsMic
  }
]

const NewPostForm: React.FC<NewPostFormProps> = ({ user, communityImageUrl }) => {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState(FORM_TABS[0].title)
  const [textInputs, setTextInputs] = useState({ title: '', body: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile()

  const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      target: { name, value }
    } = event
    setTextInputs((state) => ({ ...state, [name]: value }))
  }

  const handleCreatePost = async () => {
    const { communityId } = router.query
    const newPost = {
      communityId: communityId as string,
      communityImageUrl: communityImageUrl || '',
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split('@')[0],
      body: textInputs.body,
      title: textInputs.title,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp
    }
    setLoading(true)
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)
      if (selectedFile) {
        const imgRef = ref(storage, `posts/${postDocRef.id}/image`)
        await uploadString(imgRef, selectedFile, 'data_url')
        const downloadUrl = await getDownloadURL(imgRef)
        await updateDoc(postDocRef, { imgUrl: downloadUrl })
      }
      router.back()
    } catch (error: any) {
      console.log('create post error', error.message)
      setError(true)
    }
    setLoading(false)
  }

  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {FORM_TABS.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            loading={loading}
            onChange={onTextChange}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            setSelectedTab={setSelectedTab}
            onSelectImage={onSelectFile}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <Text>Error creating post!</Text>
        </Alert>
      )}
    </Flex>
  )
}
export default NewPostForm
