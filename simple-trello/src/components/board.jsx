import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import css from './styles/board.module.css'
import TaskList from "./list.jsx";

function Board(props){
    let [search_params, set_search_params] = useSearchParams();
    const boards_tb = JSON.parse(localStorage.getItem('boards_tb'));
    let lists_obj = JSON.parse(localStorage.getItem('lists_tb'));

    const board_id = search_params.get('board-id');
    const [board_data, set_board] = useState(boards_tb[board_id]);
    const [task_lists, set_task_lists] = useState(list_filter(board_id, lists_obj));
    const [board_editor_state, set_board_editor_state] = useState(false);
    const navigate_root = useNavigate();

    function list_filter(board_id, lists_obj){
        if(!lists_obj) return null;
        let lists_buff = {};
        for(let list_i in lists_obj){
            if(lists_obj[list_i].board_id === board_id){
                lists_buff[list_i] = lists_obj[list_i];
            }
        }
        return lists_buff;
    }

    //let task_lists = null;
    const add_list_db = (list_name, list_description)=>{
        const date = new Date().toDateString();
        let lists_tb_new = null;
        let new_list_data = {
            id: null,
            board_id: board_id,
            name: list_name,
            description: list_description,
            datetime: date
        }
        if(JSON.stringify(lists_obj) != '{}' && lists_obj){
            lists_tb_new = {...lists_obj};
            console.log(lists_tb_new);
            let id_arr = [];
            let new_id;
            for (let list_id in lists_tb_new){
                id_arr.push(list_id);
            }
            new_id = Math.max(...id_arr) + 1;
            new_list_data.id = new_id;
            lists_tb_new[new_id] = new_list_data;
            localStorage['lists_tb'] = JSON.stringify(lists_tb_new);
        }
        else{
            new_list_data.id = 1;
            lists_tb_new = {1: new_list_data};
            localStorage.setItem('lists_tb', JSON.stringify(lists_tb_new));    
        }
        set_task_lists((list_filter(board_id, lists_tb_new)));
    }

    const update_board_db = (old_board_tb, new_board_obj) => {
        boards_tb[new_board_obj.id] = new_board_obj;
        localStorage.setItem('boards_tb', JSON.stringify(boards_tb));
    }

    const delete_board_db = (updates_boards_tb) => {
        localStorage.setItem('boards_tb', JSON.stringify(updates_boards_tb));
    }
    
    const delete_board_handler = () => {
        delete boards_tb[board_id];
        delete_board_db(boards_tb);
        navigate_root('/');
    }

    const new_list_handler = (e) =>{
        e.preventDefault();
        const form_data = new FormData(e.target);
        const list_name = form_data.get("list_name");
        const list_description = form_data.get("list_desc");
        add_list_db(list_name, list_description);
    }

    const board_editor_handler = (e)=>{
        e.preventDefault();
        console.log('board editor handler');
        const new_data_from = new FormData(e.target);
        const board_new_data = {
            id: board_id,
            name: new_data_from.get('new_board_name'),
            description: new_data_from.get('new_board_desc'),
            datetime: board_data.datetime
        }
        update_board_db(boards_tb, board_new_data);
        set_board(board_new_data);
        set_board_editor_state(false);
    }

    const board_editor = () => {
        if(!board_editor_state) return null;
        return (
            <div className={css.board__editor_container}>
                <button className={css.board__editor_cancel_btn} onClick={()=>{
                    set_board_editor_state(false);
                }}>
                    <span>cancel</span>
                </button>
                <form onSubmit={board_editor_handler}>
                    <input name="new_board_name" placeholder="Edit name of the board..." type="text" defaultValue={board_data.name}/>
                    <textarea name="new_board_desc" cols="30" rows="10" placeholder="Edit the description..." defaultValue={board_data.description}></textarea>
                    <button type="submit">
                        <span>Save</span>
                    </button>
                </form>
                <button className={css.board__editor_delete_btn} onClick={delete_board_handler}>
                    <span>Delete</span>
                </button>
            </div>
        );
    }

    const lists_arr = [];
    for(let list_i in task_lists) lists_arr.push(task_lists[list_i]);
    const lists = lists_arr.map((list)=>{
        return (
            <div className={css.board__lists_item} key={list.id}>
                <TaskList list_data={list} on_lists_tb_change={set_task_lists}/>
            </div>
        );
        
    });

    const list_creator = 
        <div className={css.board__lists_creatorbox + ' ' + css.board__lists_item}>
            <p>Create list</p>
            <form onSubmit={new_list_handler}>
                <input name="list_name" type="text" placeholder="new list name"/>
                <textarea name="list_desc" id="" cols="30" rows="10"></textarea>
                <button type="submit">
                    <span>Create new list</span>
                </button>
            </form>
        </div>

    return(
        <div className={css.board__container}>
            <div className={css.board_header}>
                <div className={css.board__info_block}>
                    <h1>{board_data.name}</h1>
                    <p>{board_data.description}</p>
                    <p>{board_data.datetime}</p>
                </div>
                <div className={css.board__tools_block}>
                    <button className={css.board_editor_btn} onClick={(e)=>{
                        e.preventDefault();
                        set_board_editor_state(true);
                    }}>
                        <span>Edit board</span>
                    </button>
                </div>
            </div>
            <div className={css.board__lists_container}>
                {lists}
                {list_creator}
            </div>
            {board_editor()}
        </div>
    );
}

export default Board;