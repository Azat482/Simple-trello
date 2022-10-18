import React from "react";
import css from './styles/board.module.css'

function Board(props){

    let  board_lists;

    board_lists = 
        <div>
            list item
        </div>

    return(
        <div className={css.board__container}>
            <div className="css.board__list_container">
                {props.board_id}
                {board_lists}    
            </div>
        </div>
    );
}

export default Board;