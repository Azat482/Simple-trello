import React, {useState, useEffect} from "react";
import { json } from "react-router-dom";
import css from './styles/task_list.module.css';
import Task from "./task.jsx";

function TaskList(props){
    const list_data_props = props.list_data;
    const tasks_obj = JSON.parse(localStorage.getItem('tasks_tb')); //all tasks
    const [list_data, set_list_data] = useState(
        {
            list_id: list_data_props.id,
            list_board_id: list_data_props.board_id,
            list_name: list_data_props.name,
            list_desc: list_data_props.description,
            list_datetime: list_data_props.datetime
        }
    );
    const [list_tasks, set_tasks] = useState(task_filter(list_data.list_id, tasks_obj)); // filtred tasks of this lists, only uses in rendering
    const [list_editor_state, set_list_editor_state] = useState(false);
    const [task_creator_state, set_task_creator_state] = useState(false);
    
    function task_filter(list_id, tasks_obj){
        console.log('filter in: ', tasks_obj);
        if(!tasks_obj) return null;
        let tasks_buff = {};
        for(let task_i in tasks_obj){
            if(tasks_obj[task_i].list_id == list_id)
            {
                tasks_buff[task_i] = tasks_obj[task_i];
            }
        }
        return tasks_buff;
    }
    
    const add_task_db = (name, description, task_text, deadline)=>{
        const date = new Date().toDateString();
        let tasks_tb_new = null;
        let new_task_data = {
            id: null,
            list_id: list_data.list_id,
            name: name,
            description: description,
            task_text: task_text,
            datetime: date,
            deadline: deadline
        }
        if( JSON.stringify(tasks_obj) && tasks_obj){
            tasks_tb_new = {...tasks_obj};
            let id_arr = []
            let new_id = null;
            for(let task_id in tasks_tb_new){
                id_arr.push(task_id);
            }
            new_id = Math.max(id_arr) + 1;
            new_task_data.id = new_id;
            tasks_tb_new[new_id] = new_task_data;
            localStorage['tasks_tb'] = JSON.stringify(tasks_tb_new)
        }
        else{
            new_task_data.id = 1;
            tasks_tb_new = {1: new_task_data};
            localStorage.setItem('tasks_tb', JSON.stringify(tasks_tb_new));
        }
        set_tasks(task_filter(list_data.list_id, tasks_tb_new));
    }

    const update_list_db = (list_obj_upd) => {
        let lists_db = JSON.parse(localStorage.getItem('lists_tb'));
        lists_db[list_obj_upd.id] = list_obj_upd;
        console.log('updated ;isu: ' , lists_db);
        localStorage.setItem('lists_tb', JSON.stringify(lists_db));
    }

    const delete_list_db = (new_lists_db) =>{
        localStorage.setItem('lists_tb', JSON.stringify(new_lists_db));        
    }

    const list_delete_handler = (e) => {
        e.preventDefault();
        let lists_tb = JSON.parse(localStorage.getItem('lists_tb'));
        delete lists_tb[list_data.list_id];
        delete_list_db(lists_tb);
        props.on_lists_tb_change(lists_tb);
        set_list_editor_state(false);
    }

    const new_task_handler = (e) =>{
        e.preventDefault();
        const form_data = new FormData(e.target);
        const task_name = form_data.get('task_name');
        const task_desription = form_data.get('task_desc');
        const task_text = form_data.get('task_text');
        const task_deadline = form_data.get('task_deadline');
        add_task_db(task_name, task_desription, task_text, task_deadline);
        set_task_creator_state(false);
    }

    const list_editor_handler = (e) =>{
        e.preventDefault();
        const edited_form_data = new FormData(e.target);
        const list_obj_upd = {
            id: list_data.list_id,
            board_id: list_data.list_board_id,
            name: edited_form_data.get('list_name_upd'),
            description: edited_form_data.get('list_desc_upd'),
            datetime: list_data.list_datetime
        }
        console.log(edited_form_data);
        console.log('new data list', list_obj_upd);
        update_list_db(list_obj_upd);
        set_list_data({
            list_id: list_obj_upd.id,
            list_board_id: list_obj_upd.board_id,
            list_name: list_obj_upd.name,
            list_desc: list_obj_upd.description,
            list_datetime: list_obj_upd.datetime 
        });
        set_list_editor_state(false);
    }

    const list_editor = () =>{
        if(!list_editor_state) return null;
        return (
            <div className={css.list_editor__container}>
                <button onClick={(e)=>{
                    e.preventDefault();
                    set_list_editor_state(false);
                }}>
                    <span>cancel</span>
                </button>
                <form onSubmit={list_editor_handler}>
                    <input name="list_name_upd" type="text" placeholder="new list name" defaultValue={list_data.list_name}/>
                    <textarea name="list_desc_upd" cols="30" rows="10" placeholder="new list description" defaultValue={list_data.list_desc}></textarea>
                    <button type="submit">
                        <span>Save</span>
                    </button>
                </form>
                <button onClick={list_delete_handler}>
                    <span>Delete list</span>
                </button>
            </div>
        );
    }

    const task_creator = () => {
        if(!task_creator_state) return null;
        return(
            <div className={css.task_creator__container}>
            <h1>TASKS CREATOR</h1>
            <button onClick={(e)=>{
                set_task_creator_state(false);
            }}>
                <span>cancel</span>
            </button>
            <form onSubmit={new_task_handler}>
                <input name="task_name" type="text" placeholder="task name"/>
                <textarea name="task_desc" id="" cols="30" rows="10" placeholder="task decription"></textarea>
                <textarea name="task_text" id="" cols="30" rows="10" placeholder="task text"></textarea>
                <input name="task_deadline" type="datetime-local"/>
                <button type="submit">
                    <span>NEW TASK</span>
                </button>
            </form>
        </div>
        );
    }

    let tasks_arr = []
    for(let task_id in list_tasks) tasks_arr.push(list_tasks[task_id]);
    let tasks =tasks_arr.map((task)=>{
        return(
            <Task task_data={task} on_change_tasks_tb={set_tasks}/>
        );
    });

    return(
        <div className={css.task_list__container}>
            <div className={css.task_list__header}>
                <div className={css.task_list__header_info_block}>
                    <h1>{list_data.list_name}</h1>
                    <p>{list_data.list_desc}</p>
                </div>
                <div className={css.list_editor_btn_container}>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        set_list_editor_state(true);
                    }}>
                        <span>Edit list</span>
                    </button>
                </div>
            </div>
            <div className={css.task_creatot__btn_container}>
                <button onClick={(e)=>{
                    e.preventDefault();
                    set_task_creator_state(true);
                }}>
                    <span>add task</span>
                </button>
            </div>
            {tasks}
            {list_editor()} 
            {task_creator()}
        </div>
    );
}

export default TaskList;