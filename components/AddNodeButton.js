import { useContext } from 'react';
import { Store } from '../state/store';
import IconButton from './IconButton';

export default function AddNodeButton(props) {
  const { dispatch } = useContext(Store);
  return <IconButton action={() => dispatch({ type: 'ADD_NODE', payload: props })} icon="plus" alt="Add Node"/>;
}
