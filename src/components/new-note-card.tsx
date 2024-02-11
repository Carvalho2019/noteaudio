import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface newNoteCardProps {
  onNoteCreated: (context: string) => void
}
let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: newNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  function hundleSaveNote(event: FormEvent) {
    event.preventDefault()
    if (content === '') {
      return
    }
    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Note created with success')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvalible = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (isSpeechRecognitionAPIAvalible) {
      toast.info('So bad, your navigator havent feature for recording')
      // return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    
    speechRecognition = new speechRecognitionAPI()

    speechRecognition.lang = 'pt-Br'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event);
    }
    speechRecognition.start()
  }

  function handleStopRecording() {
    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
    setIsRecording(false)
  }

  return (
    <Dialog.Root>

      <Dialog.Trigger className='rounded-md flex flex-col text-left bg-slate-700 p-5 gap-y-3'>
        <span className='text-sm font-md text-slate-200'>Add note</span>
        <p className='text-sm leading-6 text-slate-400'>
          Record note to audio will convert to text automatically
        </p>
      </Dialog.Trigger>


      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' />
        <Dialog.Content className='overflow-hidden fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-600 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5' />
          </Dialog.Close>
          <form className='flex-1 flex flex-col'>
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-md text-slate-300'>Add Note</span>
              {
                shouldShowOnboarding ? (
                  <p className='text-sm leading-6 text-slate-400'>
                    Start <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>record your note</button> audio or choise <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>use only text</button>
                  </p>
                ) : (
                  <textarea
                    autoFocus
                    className='text-sm leading-6 bg-transparent text-slate-400 resize-none flex-1 outline-none'
                    onChange={handleContentChange}
                    value={content}
                  />
                )
              }
            </div>
            {isRecording ? (
              <button
                type='button'
                onClick={handleStopRecording}
                className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-slate-300 outline-none font-medium hover:text-slate-100'>
                <span className='size-3 rounded-full bg-red-500 animate-pulse' />
                Recording (Click for stop)
              </button>
            )
              : (
                <button
                  type='button'
                  onClick={hundleSaveNote}
                  className='w-full bg-lime-400 py-4 text-center text-slate-950 outline-none font-medium hover:bg-lime-500'>
                  Salve note
                </button>
              )
            }

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}