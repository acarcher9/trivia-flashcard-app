import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './app.css'
import axios from 'axios'

function App() {
  const [flashcards, setFlashcards] = useState([])
  const [categories, setCategories] = useState([])

  const categoryEl = useRef()
  const amountEl = useRef()

  // This call to the API generates all of the categories
  useEffect(() => {
    axios
    .get('https://opentdb.com/api_category.php')
    .then(res => {
     setCategories(res.data.trivia_categories)
    })
  }, [])

  // And this one generates the questions
  useEffect(() => {
    
  }, [])
  
  // this function is a workaround in order to convert the encoded html from the API to make it strings of text. We then apply it above to answers and options
  function decodeString(str){
    const textArea = document.createElement('textarea')
    textArea.innerHTML = str
    return textArea.value 
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios
    .get('https://opentdb.com/api.php', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
    .then(res => {
      // array of all of our flashcards
      setFlashcards(res.data.results.map((questionItem, index) => {
        const answer = decodeString(questionItem.correct_answer)
        const options = [
          ...questionItem.incorrect_answers.map(a => decodeString(a)), answer
        ]
        // individual flashcard element in return
        return {
          id: `${index}-${Date.now()}`,
          question: decodeString(questionItem.question),
          answer: answer,
          options: options.sort(() => Math.random() - .5)
        }
      }))
    })
  }

  return (
    // wrapping everything in a fragment. Here is where the form for determining the genre and # of questions pulled up
    <>
    <form className="header" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" ref={categoryEl}>
          {categories.map(category => {
            return <option value={category.id} key={category.id}>{category.name}</option>
          })}
        </select>
      </div>
      <div className="form-group">
      <label htmlFor="amount">Number of Questions</label>
      <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl}/>
      </div>
      <div className="form-group">
        <button className="btn">Generate</button>
      </div>
    </form>
    <div className="container">
    <FlashcardList flashcards={flashcards} />
    </div>
    </>
  );
}



export default App;
