import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Header } from '../components/header';
import { useMe } from '../hooks/useMe';
import { NotFound } from '../pages/404';
import { Restaurants } from '../pages/client/restaurants';
import { ConfirmEmail } from '../pages/user/confirm-email';
import { EditProfile } from '../pages/user/edit-profile';
import { Search } from '../pages/client/search';
import { Category } from '../pages/client/category';
import { Restaurant } from '../pages/client/restaurant';


const ClientRoutes = [
    <Route key={1} exact path="/" element={<Restaurants />} />,
    <Route key={2} exact path="/confirm" element={<ConfirmEmail />} />,
    <Route key={3} exact path="/edit-profile" element={<EditProfile />} />,
    <Route key={4} exact path="/search" element={<Search />} />,
    <Route key={5} exact path="/category/:slug" element={<Category />} />,
    <Route key={6} exact path="/restaurants/:id" element={<Restaurant />} />
];

export const LoggedInRouter = () => {
    const { data, loading, error } = useMe();
    if (!data || loading || error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <span className="font-medium text-xl tracking-wide">Loading...</span>
            </div>
        )
    }
    return (
        <Router>
            <Header />
            <Routes>
                {data.me.role === "Client" && ClientRoutes}
                <Route path="*" element={<NotFound />} />
            </Routes>

        </Router>
    )
}

// redirect <Route path="*" element={<NotFound />} />