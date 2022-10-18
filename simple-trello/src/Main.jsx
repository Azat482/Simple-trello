import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import Header from './components/header.jsx';
import BoardMng from './components/board-manager.jsx';
import Board from './components/board.jsx';

function Main(props){
    ///*
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path='/' element={<BoardMng/>}/>
                <Route path='/board' element={<Board/>}/>
            </Routes>
        </Router>
    );
    //*/

}

export default Main;