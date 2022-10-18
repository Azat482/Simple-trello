import React, {useState, useEffect} from "react";
import { json, Link } from "react-router-dom";
import css from "./styles/board-manager.module.css";


function BoardMng(props){
    const [boards_list, set_boards_list] = useState(JSON.parse(localStorage.getItem('boards_tb'))); //null - if empty
    let boards = null;

    const add_board_db = (name, description)=>{
        const date = new Date().toDateString();
        let boards_tb_obj = null;
        let new_board_data = {
            id: null,
            name: name,
            description: description,
            datetime: date,                 
        };
        if(boards_list){
            boards_tb_obj = {...boards_list}; //new obj to update state and render again
            let id_arr = [];
            let new_id = null;
            for (let board_id in boards_tb_obj){
                id_arr.push(board_id);
            }
            new_id = Math.max(...id_arr) + 1;
            new_board_data.id = new_id;
            boards_tb_obj[new_id] = new_board_data;
            localStorage['boards_tb'] =JSON.stringify(boards_tb_obj);
        }
        else{
            new_board_data.id = 1;
            boards_tb_obj = {1 : new_board_data};
            localStorage.setItem('boards_tb', JSON.stringify(boards_tb_obj));
        }
        set_boards_list(boards_tb_obj);
    }

    const new_board_handler = (e)=>{
        e.preventDefault();
        const form_data = new FormData(e.target);
        const new_board_name = form_data.get('board_name'); 
        const new_board_desc = form_data.get('board_desc');
        add_board_db(new_board_name, new_board_desc);
    }

    window.addEventListener('storage', (e)=>{
        if(e.key !== 'boards_tb') return;
        console.log('added: ', e.key, 'newValue: ', e.newValue, 'oldValue:', e.oldValue);

        /*...*/
    });    

    useEffect(()=>{
       console.log('use effect: ', boards_list);
    });

    const board_editor = 
        <div className={css.board_mng__editor + ' ' + css.board_mng__item}>
            <div className={css.board_mng__editor_header}>
                <h2>Create new board</h2>
            </div>
            <form onSubmit={new_board_handler}>
                <input name="board_name" placeholder="Enter name of the board..." type="text" />
                <textarea name="board_desc" cols="30" rows="10" placeholder="Enter the description..." ></textarea>
                <button type="submit">
                    <span>Add board</span>
                </button>
            </form>
        </div>
    
    let boards_arr = []
    for (let n_board_data in boards_list){
        boards_arr.push(boards_list[n_board_data]);
    }


    boards = boards_arr.map((item)=>{
        return (
        <div className={css.board_mng__item} key={item.id}>
            <div className={css.board_mng_item_info}>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>{item.datetime}</p>
            </div>
            <Link className={css.board_mng_item_button_container} to='/board'>
                <span>Go To</span>
            </Link>            
        </div>
        )
    });

    return(
        <div className={css.board_mng}>
            <div className={css.board_mng__container}>
                {boards}
                {board_editor}
            </div>
        </div>
    );
}

export default BoardMng;