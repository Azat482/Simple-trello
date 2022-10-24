import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import css from "./styles/board-manager.module.css";


function BoardMng(props){
    const [boards_list, set_boards_list] = useState(JSON.parse(localStorage.getItem('boards_tb'))); //null - if empty
    let boards = null;

   
    const add_board_db = (name, description)=>{
        console.log('boards lists: ', boards_list);
        const date = new Date().toDateString();
        let boards_tb_new = null;
        let new_board_data = {
            id: null,
            name: name,
            description: description,
            datetime: date,                 
        };
        if(JSON.stringify(boards_list) != '{}' && boards_list){
            console.log('boards lists is true: ');
            boards_tb_new = {...boards_list}; //new obj to update state and render again
            let id_arr = [];
            let new_id = null;
            for (let board_id in boards_tb_new){
                id_arr.push(board_id);
            }
            new_id = Math.max(...id_arr) + 1;
            new_board_data.id = new_id;
            boards_tb_new[new_id] = new_board_data;
            localStorage['boards_tb'] =JSON.stringify(boards_tb_new);
        }
        else{
            new_board_data.id = 1;
            boards_tb_new = {1 : new_board_data};
            localStorage.setItem('boards_tb', JSON.stringify(boards_tb_new));
        }
        set_boards_list(boards_tb_new);
    }

    const new_board_handler = (e)=>{
        e.preventDefault();
        const form_data = new FormData(e.target);
        const new_board_name = form_data.get('board_name'); 
        const new_board_desc = form_data.get('board_desc');
        add_board_db(new_board_name, new_board_desc);
    }

    //storage listener
    window.addEventListener('storage', (e)=>{
        if(e.key !== 'boards_tb') return;
        set_boards_list(JSON.parse(e.newValue));
        /*...*/
    });    

    const board_creatorbox = 
        <div className={css.board_mng__editor + ' ' + css.board_mng__item}>
            <div className={css.board_mng__editor_header}>
                <h3 className={css.board_mng__item_name}>Добавить доску</h3>
            </div>
            <form onSubmit={new_board_handler}>
                <input name="board_name" placeholder="Название доски..." type="text" />
                <textarea name="board_desc" placeholder="Описание доски..." ></textarea>
                <button type="submit">
                    <span>Добавить</span>
                </button>
            </form>
        </div>
    
    let boards_arr = []
    for (let n_board_data in boards_list){
        boards_arr.push(boards_list[n_board_data]);
    }

    boards = boards_arr.map((item)=>{
        let board_ref = `/board?board-id=${item.id}&board-name=${item.name}`;
        return (
        <div className={css.board_mng__item} key={item.id}>
            <div className={css.board_mng_item_info}>
                <h3 className={css.board_mng__item_name}>{item.name}</h3>
                <p className={css.board_desc}>{item.description}</p>
                <p className={css.board_datetime}>{item.datetime}</p>
            </div>
            <span className={css.board_sep_line}></span>
            <Link className={css.board_mng_item_button_container} to={board_ref}>
                <span>Перейти</span>
            </Link>            
        </div>
        )
    });

    return(
        <div className={css.board_mng__container}>
            <div className={css.board_mng__content}>
                {boards}
                {board_creatorbox}
            </div>
        </div>
    );
}

export default BoardMng;