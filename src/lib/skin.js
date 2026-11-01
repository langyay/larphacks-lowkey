// Which app the feed is dressed as: YouTube Shorts, TikTok or Instagram Reels.
// The setting lives in settings.app; FeedWithComments provides it to everything below.

import { createContext, useContext } from 'react'

const SkinContext = createContext('youtube')

export const SkinProvider = SkinContext.Provider
export const useSkin = () => useContext(SkinContext)
