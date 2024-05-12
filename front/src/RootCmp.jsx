
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { UserIndex } from './pages/UserIndex.jsx'
import { UserDetails } from './pages/UserDetails.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { UserMsg } from './cmps/UserMsg.jsx'

export function App() {

    function RouteGuard({ children }) {
        const loggedinUser = userService.getLoggedinUser()

        function isAllowed() {
            return loggedinUser?.isAdmin
        }

        if (!isAllowed()) return <Navigate to="/" />
        return children
    }

    return (
        <Router>
            <div className='main-app'>
                <AppHeader />
                <main className='container'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/user' element={<UserIndex />} />
                        <Route path='/user/:userId' element={<UserDetails />} />
                        <Route path='/bug' element={<BugIndex />} />
                        <Route path='/bug/:bugId' element={<BugDetails />} />
                        <Route path='/about' element={
                            <RouteGuard >
                                <AboutUs />
                            </RouteGuard>} />
                    </Routes>
                </main>
                <AppFooter />
                <UserMsg />
            </div>
        </Router>
    )
}
