import { StoreProvider } from '../state/store';
import App from '../components/App';

export default function Index() {
  return (
    <StoreProvider>
      <App/>
    </StoreProvider>
  );
};

