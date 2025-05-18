// App.js
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes';
import DefaultComponent from './components/DefaultComponent/DefaultComponent';
import AdminRoute from './pages/AdminPage/AdminRoute/AdminRoute.js';

function App() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.isAdmin ? (
                    <AdminRoute element={<Layout><Page /></Layout>} {...route} />
                  ) : (
                    <Layout>
                      <Page />
                    </Layout>
                  )
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
