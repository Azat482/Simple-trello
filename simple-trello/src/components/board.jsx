import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import css from './styles/board.module.css'
import TaskList from "./list.jsx";

function Board(props){
    let [search_params, set_search_params] = useSearchParams();
    const boards_tb = JSON.parse(localStorage.getItem('boards_tb'));
    let lists_obj = JSON.parse(localStorage.getItem('lists_tb'));

    const board_id = search_params.get('board-id');
    const [board_data, set_board] = useState(boards_tb[board_id]);
    const [task_lists, set_task_lists] = useState(list_filter(board_id, lists_obj));
    
    function list_filter(board_id, lists_obj){
        if(!lists_obj) return null;
        let lists_buff = {};
        for(let list_i in lists_obj){
            if(lists_obj[list_i].board_id == board_id){
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
        if(lists_obj){
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
    
    const new_list_handler = (e) =>{
        e.preventDefault();
        const form_data = new FormData(e.target);
        const list_name = form_data.get("list_name");
        const list_description = form_data.get("list_desc");
        add_list_db(list_name, list_description);
    }


    const lists_arr = [];
    for(let list_i in task_lists) lists_arr.push(task_lists[list_i]);
    const lists = lists_arr.map((list)=>{
        return (
            <div className={css.board__lists_item} key={list.id}>
                <TaskList list_data={list}/>
            </div>
        );
        
    });

    const list_editor = 
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
                <h1>{board_data.name}</h1>
                <p>{board_data.description}</p>
                <p>{board_data.datetime}</p>
            </div>
            <div className={css.board__lists_container}>
                {lists}
                {list_editor}
            </div>
        </div>
    );
}

export default Board;