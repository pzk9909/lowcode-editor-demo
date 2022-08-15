import Home from './pages/Home/Home';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import { Button } from 'antd';
import routes from './router/router'
import store from './store/store';
function App() {
  const handleSave = () => {
    const schemaa = store.getState().schemaa
    console.log(schemaa.get(0));
    const jsonSchema = JSON.stringify(schemaa)
    console.log(jsonSchema);
    localStorage.setItem('schema', jsonSchema)
  }
  return (
    <div className="App">
      <Router>

        <div className='main'>
          <div className='app-nav'>
            <Button onClick={handleSave}>保存</Button>
            <Link to='/'>编辑</Link>
            <Link to='/preview'>预览</Link>
          </div>
          <Routes>
            {routes.map((route, key) => {
              if (route.exact) {
                return (
                  <Route
                    key={key}
                    path={route.path}
                    element={<route.component />}
                  />
                )
              } else {
                return (
                  <Route
                    key={key}
                    path={route.path}
                  />
                )
              }
            })}
            <Route element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>

  );
}

export default App;
