import { useSkin } from '@/lib/skin'
import * as instagram from '@/skins/instagram'
import * as tiktok from '@/skins/tiktok'
import * as youtube from '@/skins/youtube'

// The cards ask for the pieces of whichever look is chosen in Settings.
// Props every piece gets (the cards build them):
//   channel, title, paused, onPause, soundOn, onSound, soundLabel, onCover,
//   onSearch, onClear, onFullscreen, captionsOn / onCaptions (flashcards only),
//   subscribed, onSubscribe, rail (like / save / comments / share handlers).
const looks = { youtube, tiktok, instagram }

export function useLook() {
  return looks[useSkin()] ?? youtube
}
