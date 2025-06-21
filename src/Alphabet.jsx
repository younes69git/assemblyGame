
const Alphabet = (props) => {
  const styles = (props.incorrect) ? {backgroundColor : "#EC5D49"} : props.correct ? {backgroundColor : "#10A95B"} : undefined
  return ( 
    <span className={props.notUsing} onClick={() => (props.letterTesting(props.id))} style={styles}>{props.character}</span>
  )
}
export default Alphabet;