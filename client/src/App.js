import './App.css';
import { Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import SavedResponseCode from './pages/SavedResponseCode';

function App() {
  return (
      <Routes>
        <Route path ='/userlogin' element={ <Login/> } />
        <Route path ='/userregister' element={ <Register/>} />
        <Route path ='/' element={ <Login/> } />
        <Route path ='/searchresponsecode' element ={ <Search/> }/>
        <Route path ='/SavedList' element={ <SavedResponseCode/>} />
      </Routes>
  );
}

export default App;
