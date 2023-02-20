/* eslint-disable react-hooks/exhaustive-deps */
import { communityState } from '@/atoms/communitiesAtom'
import { DirectoryMenuItem, directoryMenuState } from '@/atoms/directoryMenuAtom'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FaReddit } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'

const useDirectory = () => {
  const [directoryState, setDirecoryState] = useRecoilState(directoryMenuState)
  const { currentCommunity } = useRecoilValue(communityState)
  const router = useRouter()

  const toggleMenuOpen = () => setDirecoryState((state) => ({ ...state, isOpen: !directoryState.isOpen }))

  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirecoryState((state) => ({ ...state, selectedMenuItem: menuItem }))
    router.push(menuItem.link)
    if (directoryState.isOpen) toggleMenuOpen()
  }

  useEffect(() => {
    if (currentCommunity)
      setDirecoryState((state) => ({
        ...state,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          icon: FaReddit,
          iconColor: 'blue.500',
          imageURL: currentCommunity.imageUrl
        }
      }))
  }, [currentCommunity])

  return { directoryState, toggleMenuOpen, onSelectMenuItem }
}
export default useDirectory
