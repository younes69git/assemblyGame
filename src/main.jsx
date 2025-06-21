import { useState , useEffect , useRef } from "react";
import Alphabet from "./Alphabet";
import { languages } from "./Language";
import {nanoid} from "nanoid"
import Confetti from 'react-confetti';
import {useWindowSize } from 'react-use';
import {getRandomWord , getRandomOption} from "./utile"
const Main = () => {
  const [alphabet , setAlphabet] = useState(() => genrateAlphabet())
  const [word , setWord] = useState(getRandomWord().toUpperCase().split(""));
  const [counter , setCounter] = useState(0)
  const [comment , setComment] = useState(null);
  const [newGame , setNewGame] = useState(false)
  const [gameWon , setGameWon] = useState(false) 
  const focusNewGame = useRef(null)
  const { width, height } = useWindowSize();
  const language = languages
  const NotAllowed = counter >= language.length - 1 || gameWon
  function genrateAlphabet () {
    return Array.from({length : 26 } , (_ , i) =>(String.fromCharCode(65 + i))).map((alph) =>(
      {alph : alph , incorrect : false , correct : false , id : nanoid()}
    ))
  }

  function rePlayGame() {
    setAlphabet(genrateAlphabet());
    setCounter(0)
    setWord(getRandomWord().toUpperCase().split(""))
    setComment(null)
    setNewGame(false)
    setGameWon(false)
  }
  function letterTesting(id) {
    ((counter < language.length - 1) && !gameWon) && setAlphabet(prev => (
      prev.map(al => (
        al.id === id ? ((word.some(w =>  w === al.alph)) ? {...al , correct:true} : {...al , incorrect:true}) : al
      ))
    ))
  }

  useEffect(()=> {
    if(counter > 0) {
      setComment(getRandomOption(language[counter - 1].name));
    }
    if (counter === language.length - 1) {
      setNewGame(true)
    }
  },[counter])

  useEffect(() => {
    const testWinning = word.every(char => {return alphabet.some(al => al.alph === char  && al.correct === true)})
    let temporaryTest = counter
    const mistake = alphabet.filter(al => al.incorrect).length;
    setCounter(prev => (prev < mistake ? mistake :  prev))
    if(counter === temporaryTest) {
      setComment(null)
    }
    if(testWinning) {
      setGameWon(true)
      setNewGame(true)
    }
  },[alphabet])

  useEffect(()=> {
    if(gameWon) {
      focusNewGame.current.focus()
    }
  },[gameWon])
  return ( 
    <main className="main">
      {gameWon && <Confetti width={width} height={height}/>}
      <div className="text">
        <h3>Assembly: Endgame</h3>
        <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>
        {(comment !== null && counter < language.length -1) && <button className="comment" >{comment}</button>}
        {(counter === language.length - 1 ) && <button className="result r"><h5>Game over!</h5><p>You lose! Better start learining Assembly</p></button>}
        {gameWon && <button className="result g"><h5>You Win!</h5><p>well done! 🎉</p></button>}
      </div>

      <div className="languages">
        {
          language.map((lang, index) => {
          const isMistake = index < counter;
          return (
            <span
              key={nanoid()}
              className={isMistake ? "mistake" : ""}
              style={{
                backgroundColor: lang.backgroundColor,
                color: lang.color,
              }}
            >
              {lang.name}
            </span>
          )
          })
        }
      </div>

      <div className="letters">
      {word.map((char) => {
          const isCorrect = alphabet.some(al => al.alph == char && al.correct == true)
          if(!newGame) {
            return <span key={nanoid()} >{isCorrect ? char : ""}</span>
          }
          else {
            return <span style={{color : isCorrect ? "white" : "red"}} key={nanoid()} >{char}</span>
          }
        })}
      </div>

      <div className="alphabet">
        {!NotAllowed && alphabet.map(al => (
          <Alphabet 
            character = {al.alph}
            key={al.id}
            id={al.id}
            letterTesting={letterTesting}
            correct={al.correct}
            incorrect={al.incorrect}
          />
        ))}
        {NotAllowed && alphabet.map(al => (
          <Alphabet 
            character = {al.alph}
            key={al.id}
            id={al.id}
            letterTesting={letterTesting}
            correct={al.correct}
            incorrect={al.incorrect}
            notUsing = {"not-allowed"}
          />
        ))}
      </div>
      <div className="new-game">
        {newGame && <button ref={focusNewGame} onClick={rePlayGame} >New Game</button>}
      </div>
    </main>
  )
}
export default Main ;