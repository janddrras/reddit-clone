import { Community, communityState } from '@/atoms/communitiesAtom'
import { auth, firestore, storage } from '@/firebase/clientApp'
import useSelectFile from '@/hooks/useSelectFile'
import { Box, Flex, Text, Icon, Stack, Divider, Button, Image, Spinner } from '@chakra-ui/react'
import { updateDoc, doc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import moment from 'moment'
import Link from 'next/link'
import { FC, useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FaReddit } from 'react-icons/fa'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { RiCakeLine } from 'react-icons/ri'
import { useSetRecoilState } from 'recoil'

type AboutProps = {
  communityData: Community
}

const About: FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth)
  const selectedFileRef = useRef<HTMLInputElement>(null)
  const { selectedFile, onSelectFile } = useSelectFile()
  const [uploadingImage, setUploadingImage] = useState(false)
  const setCommunityStateValue = useSetRecoilState(communityState)

  const onUpdateImage = async () => {
    if (!selectedFile) return
    setUploadingImage(true)
    try {
      const imgRef = ref(storage, `communities/${communityData.id}/image`)
      await uploadString(imgRef, selectedFile, 'data_url')
      const downloadUrl = await getDownloadURL(imgRef)
      await updateDoc(doc(firestore, 'communities', communityData.id), {
        imageUrl: downloadUrl
      })
      setCommunityStateValue((state) => ({
        ...state,
        currentCommunity: { ...state.currentCommunity, imageUrl: downloadUrl } as Community
      }))
    } catch (error) {
      console.log('avatar upload error', error)
    }
    setUploadingImage(false)
  }

  return (
    <Box position='sticky' top='14px'>
      <Flex
        p={3}
        justify='space-between'
        align='center'
        bg='blue.400'
        color='white'
        borderRadius='4px 4px 0px 0px'
      >
        <Text fontSize='10pt' fontWeight={700}>
          About community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction='column' p={3} bg='white' borderRadius='0px 0px 4px 4px'>
        <Stack>
          <Flex width='100%' p={2} fontSize='10pt'>
            <Flex direction='column' flexGrow={1} fontWeight={700}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction='column' flexGrow={1}>
              <Text>1</Text>
              <Text>online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex align='center' width='100%' p={1} fontSize='10pt' fontWeight={500}>
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>{`Created ${moment(new Date(communityData.createdAt?.seconds * 1000)).format(
                'MMM DD, YYYY'
              )}`}</Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height='30px' width='100%'>
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize='10pt'>
                <Text fontWeight={600}>Admin</Text>
                <Flex align='center' justify='space-between'>
                  <Text
                    color='blue.500'
                    cursor='pointer'
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>
                  {communityData.imageUrl || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageUrl}
                      alt='avatar'
                      borderRadius='full'
                      boxSize='40px'
                    />
                  ) : (
                    <Icon as={FaReddit} fontSize={40} mr={2} color='brand.100' />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor='pointer' onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  id='file-upload'
                  type='file'
                  accept='image/x-png,image/gif,image/jpeg'
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  )
}
export default About
