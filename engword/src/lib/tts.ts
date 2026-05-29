/**
 * Web Speech API TTS — 브라우저 로컬 실행, 오프라인 동작.
 */
export function speak(text: string, lang = 'en-US'): void {
  if (typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return

  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = lang
  window.speechSynthesis.speak(utter)
}
