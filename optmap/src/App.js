import './App.css';
import { BrowserRouter } from "react-router-dom";
import { RouterConfig } from './navigation/routerconfig';


const App = () => (
  <BrowserRouter>
    <RouterConfig />
  </BrowserRouter>
)

export default App;

