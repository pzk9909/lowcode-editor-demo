import Home from './pages/Home/Home';
import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { Button, message } from 'antd';
import routes from './router/router'
import store from './store/store';
import { useEffect, useState } from 'react';
import { initSchemaMap, initNameArray } from './store/action'
function App() {
  const [route, setRoute] = useState('edi')
  const [isNew,setIsNew] = useState(false)
  useEffect(() => {
    const schemaJSON = localStorage.getItem('schema')
    if (schemaJSON) {
      const schema = JSON.parse(schemaJSON)
      console.log(schema);
      store.dispatch(initSchemaMap(schema))
      store.dispatch(initNameArray(schema))
    } else {
      store.dispatch(initSchemaMap({}))
    }
  }, [])
  store.subscribe(() => {
    setIsNew(store.getState().editorItem.isNew) //更新是否允许拖拽
  }); //store状态更新触发
  const [jsonSchema, setJsonSchema] = useState('')

  const handleSave = () => {
    const schema = store.getState().schemaMap.get(0)
    // console.log(schema);
    const jsonSchema = JSON.stringify(schema)
    setJsonSchema(jsonSchema)
    // console.log(jsonSchema);
    localStorage.setItem('schema', jsonSchema)
    console.log(store.getState().schemaMap);
    // console.log(store.getState().nameArray);
  }

  const goto = (route: string) => {
    console.log(11);
    setRoute(route)
    console.log(route);
    if (store.getState().editorItem.isNew) {
      message.warn('新增组件未设置字段名')
      return
    }
  }


  return (
    <div className="App">
      <Router>
        <div className='main'>
          <div className='app-nav'>
            {route === 'pre' ?
              (<Button disabled={isNew} onClick={() => { goto('edi') }}><Link to='/'>编辑</Link></Button>)
              :
              (<Button disabled={isNew} onClick={() => { goto('pre') }}><Link to='/preview'>预览</Link></Button>)
            }
            <Button disabled={isNew} onClick={handleSave}>保存</Button>
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
