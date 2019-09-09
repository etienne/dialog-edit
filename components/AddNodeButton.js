import { useContext } from 'react';
import { Store } from '../state/store';

export default function AddNodeButton(props) {
  const { dispatch } = useContext(Store);
  return <button onClick={() => dispatch({ type: 'ADD_NODE', payload: props })}>+</button>;
}
