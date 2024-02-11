import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'
import { toast } from 'sonner'

interface Note {
  id: string
  date: Date
  content: string
}

function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    }
    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(2024, 1, 23),
      content
    }

    const noteArray = [newNote, ...notes]

    setNotes(noteArray)

    localStorage.setItem('notes', JSON.stringify(noteArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  function onNoteDeleted(id:string){
    const notesArray = notes.filter(note => {
      return note.id !== id
    })
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
    toast.success('Note deleted')

  }

  const filterNote = search !== '' 
  ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase(  )))
  : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img src={logo} alt='NLW expert' />
      <form className='w-full'>
        <input
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          type='text'
          placeholder='Search in your note'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filterNote.map((note) => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
        })}
      </div>
    </div>
  )
}

export default App
