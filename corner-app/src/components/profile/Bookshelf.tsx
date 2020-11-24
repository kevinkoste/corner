import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from './profile.module.css'

import { bookApi } from '../../libs/api'
import {
  useProfileContext,
  updateComponent,
  deleteBookById,
} from '../../context/ProfileContext'

import { BookshelfProps } from '../../models/Profile'

export const EditBookshelf: React.FC<BookshelfProps> = ({ id, props }) => {
  const { profileState } = useProfileContext()

  if (profileState.editing) {
    return (
      <div className={styles.container}>
        <div className={styles.shadowBox}>
          <h1>Bookshelf</h1>
          <AddBookshelfRow id={id} />
          {props.books.map((book, idx) => (
            <EditBookshelfRow key={idx} book={book} />
          ))}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.containerPublic + ' static'}>
        <h1>Bookshelf</h1>
        {props.books.map((book, idx) => (
          <BookshelfRow key={idx} book={book} />
        ))}
      </div>
    )
  }
}

// public component
export const Bookshelf: React.FC<BookshelfProps> = ({ props }) => {
  if (props.books.length !== 0) {
    return (
      <div className={styles.containerPublic}>
        <h1>Bookshelf</h1>
        {props.books.map((book, idx) => (
          <BookshelfRow key={idx} book={book} />
        ))}
      </div>
    )
  } else {
    return null
  }
}

function BookshelfRow({ book }) {
  const { id, title, author, date, image } = book

  return (
    <div className={styles.rowContainer}>
      <img
        className={styles.rowBookImage}
        src={image}
        key={image}
        onError={(event: any) => {
          event.target.onError = null
          event.target.src = '/icons/building.svg'
        }}
      />
      <div className={styles.rowText}>
        <p>{title}</p>
        <p>{author}</p>
        <p>{date}</p>
      </div>
    </div>
  )
}

function EditBookshelfRow({ book }) {
  const { id, title, author, date, image } = book
  const { profileDispatch } = useProfileContext()

  const handleDeleteBook = () => {
    profileDispatch(deleteBookById(id))
  }

  return (
    <div className={styles.rowContainer}>
      <div className={styles.rowImageContainer}>
        <img
          className={styles.rowBookImage}
          src={image}
          key={image}
          onError={(event: any) => {
            event.target.onError = null
            event.target.src = '/icons/building.svg'
          }}
        />
        <img
          className={styles.rowDeleteImage}
          src="/icons/x-black.svg"
          onClick={handleDeleteBook}
        />
      </div>

      <div className={styles.rowText}>
        <p>{title}</p>
        <p>{author}</p>
        <p>{date}</p>
      </div>
    </div>
  )
}

function AddBookshelfRow({ id }) {
  const { profileState, profileDispatch } = useProfileContext()

  const [textInput, setTextInput] = useState('')
  const [book, setBook] = useState({
    id: '',
    title: '',
    author: '',
    date: '',
    link: '',
    image: '',
  })

  // update data on a timeout (debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (textInput !== '') {
        const { data } = await bookApi({
          method: 'get',
          url: `/books/v1/volumes`,
          params: {
            q: textInput,
          },
        })
        const book = data.items[0]
        const imageRaw = book.volumeInfo.imageLinks.thumbnail
        const image = imageRaw.slice(0, 4) + 's' + imageRaw.slice(4)
        setBook({
          id: uuidv4().toString(),
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors[0],
          date: book.volumeInfo.publishedDate.substring(0, 4),
          link: book.volumeInfo.infoLink,
          image: image,
        })
      }
    }, 200)
    return () => clearTimeout(delayDebounceFn)
  }, [textInput])

  // save new book item
  const onAcceptClick = () => {
    profileDispatch(
      updateComponent({
        id: id,
        type: 'bookshelf',
        props: {
          books: [
            book,
            ...profileState.components.find((comp) => comp.type === 'bookshelf')
              ?.props.books,
          ],
        },
      })
    )
    setTextInput('')
    setBook({
      id: '',
      title: '',
      author: '',
      date: '',
      link: '',
      image: '',
    })
  }

  // enter key advances form
  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onAcceptClick()
    }
  }

  return (
    <div className={styles.addContainer}>
      <div className={styles.addFormContainer}>
        <p>Enter the title of a book</p>
        <input
          className={styles.rowAddInput}
          type="url"
          placeholder={'Great Expectations'}
          onChange={(event: any) => setTextInput(event.target.value)}
          value={textInput}
          onKeyDown={onKeyDown}
        />
      </div>
      {textInput !== '' && (
        <div onClick={onAcceptClick}>
          <PreviewBookshelfRow book={book} />
        </div>
      )}
    </div>
  )
}

function PreviewBookshelfRow({ book }) {
  const { title, author, date, image } = book

  return (
    <div className={styles.rowContainer}>
      <img
        className={styles.rowBookImage}
        src={image}
        key={image}
        onError={(event: any) => {
          event.target.onError = null
          event.target.src = '/icons/building.svg'
        }}
      />
      <div className={styles.rowText} style={{ color: 'gray' }}>
        <p>{title}</p>
        <p>{author}</p>
        <p>{date}</p>
      </div>
    </div>
  )
}
