import { Link, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import RickAndMorty from './views/RickAndMorty';

import Product from './views/Product';
import './App.css';

function App() {
  return (
    <div className='App'>
      <div className='d-flex justify-content-center py-4'>
          <Link to='/rickandmorty'>
              <h3>Rick and Morty</h3>
          </Link>
          <Link to='/product' style={{marginLeft: '25px'}}>
              <h3>Product</h3>
          </Link>
      </div>
      <Switch>
        <Route esxact path='/rickandmorty' component={RickAndMorty} />
        <Route exact path='/product' component={Product} />
      </Switch>
    </div>
  );
}

export default App;
