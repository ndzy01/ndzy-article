import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useReducer } from 'react';
import zhCn from 'antd/locale/zh_CN';
import Layout from './pages/Layout';
import NoMatch from './pages/NoMatch';
import Article from './pages/Article';
import { initialState, reducer, ReduxContext } from './redux';

const Router = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ConfigProvider locale={zhCn}>
      <ReduxContext.Provider value={{ state, dispatch }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Article />} />
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </ReduxContext.Provider>
    </ConfigProvider>
  );
};

export default Router;
