import React, { useState, useEffect, useRef } from 'react'

export default function Flashcard({ flashcard }) {
    const[flip, setFlip] = useState(false)
    const [height, setHeight] = useState('initial')

    // Creating elements: These variables allow us to have reference to any variable we want that persist through renders of our app. we always know what our "front element" will be (i.e. frontEl.current, etc.)
    const frontEl = useRef()
    const backEl = useRef()

    // calculating the maximum height of our card (rectangle) on front and back, default minimum is 100
    function setMaxHeight(){
        const frontHeight = frontEl.current.getBoundingClientRect().height
        const backHeight = backEl.current.getBoundingClientRect().height
        setHeight(frontHeight, backHeight, 100)
    }

    // allows the height to be constantly re-calculated based on the lenghth of the text of the question
    useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options])
    
    // another useEffect in order to recalculate the height of cards *every time* the page changes so that individual cards are dynamic as well
    useEffect(() => {
        window.addEventListener('resize', setMaxHeight)
        return () => window.removeEventListener('resize', setMaxHeight)
    }, [])

    return (
        <div 
        className={`card ${flip ? 'flip' : ''}`}
        style={{ height: height }}
        onClick={() => setFlip(!flip)}
        >
            <div className="front" ref={frontEl}>
                {flashcard.question}
                <div className="flashcard-options">
                    {flashcard.options.map(option => {
                        return <div className="flashcard-option" key={option}>{option}</div>
                    })}
                </div>
            </div>
            <div className="back" ref={backEl}>{flashcard.answer}</div>
            {/* {flip ? flashcard.answer : flashcard.question} */}
        </div>
    )
}

