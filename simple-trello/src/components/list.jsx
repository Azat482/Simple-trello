import React, {useState, useEffect} from "react";
import { json } from "react-router-dom";
import css from './styles/task_list.module.css';
import Task from "./task.jsx";
import cancel_btn from './images/cancel.svg'


function TaskList(props){
    const list_data_props = props.list_data;
    const [list_data, set_list_data] = useState(
        {
            list_id: list_data_props.id,
            list_board_id: list_data_props.board_id,
            list_name: list_data_props.name,
            list_desc: list_data_props.description,
            list_datetime: list_data_props.datetime
        }
    );
    const [tasks_tb_state, set_tasks_state] = useState(JSON.parse(localStorage.getItem('tasks_tb'))); //all tasks
    const [list_editor_state, set_list_editor_state] = useState(false);
    const [task_creator_state, set_task_creator_state] = useState(false);
    const list_tasks = task_filter(list_data.list_id, tasks_tb_state); // filtred tasks of this lists, only uses in rendering
    
    

    function task_filter(list_id, tasks_obj){
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
        const tasks_obj = JSON.parse(localStorage.getItem('tasks_tb'));
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
        if( JSON.stringify(tasks_obj) != '{}' && tasks_obj){
            tasks_tb_new = {...tasks_obj};
            let id_arr = []
            let new_id = null;
            for(let task_id in tasks_tb_new){
                id_arr.push(task_id);
            }
            new_id = Math.max(...id_arr) + 1;
            new_task_data.id = new_id;
            console.log('new id', new_id, 'id arr', id_arr);
            tasks_tb_new[new_id] = new_task_data;
            localStorage['tasks_tb'] = JSON.stringify(tasks_tb_new)
        }
        else{
            new_task_data.id = 1;
            tasks_tb_new = {1: new_task_data};
            localStorage.setItem('tasks_tb', JSON.stringify(tasks_tb_new));
        }
        set_tasks_state(tasks_tb_new);
        props.on_change_board_tasks_tb_state(tasks_tb_new);
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

    window.addEventListener('storage', (e)=>{
        if(e.key != 'tasks_tb') return;
        set_tasks_state(JSON.parse(e.newValue));
        props.on_change_board_tasks_tb_state(JSON.parse(e.newValue));
    });

    const list_editor = () =>{
        if(!list_editor_state) return null;
        return (
            <div className={css.list_editor__container}>
                <div className={css.list_editor__content}>
                    <button className={css.list_editor__cancel_btn} onClick={(e) => {
                        e.preventDefault();
                        set_list_editor_state(false);
                    }}>
                        <img src={cancel_btn} alt="cancel" width='50px' height='50px'/>
                    </button>
                    <form onSubmit={list_editor_handler}>
                        <label htmlFor="list_name_upd">Название списка:</label>
                        <input name="list_name_upd" type="text" placeholder="new list name" defaultValue={list_data.list_name} />
                        <label htmlFor="list_desc_upd">Описание списка:</label>
                        <textarea name="list_desc_upd" cols="30" rows="10" placeholder="new list description" defaultValue={list_data.list_desc}></textarea>
                        <button className={css.list_editor__save_btn}  type="submit">
                            <span>Сохранить</span>
                        </button>
                        <button className={css.list_editor__delete_btn} onClick={list_delete_handler}>
                            <span>Удалить</span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const task_creator = () => {
        if(!task_creator_state) return null;
        return(
            <div className={css.task_creator__container}>
                <div className={css.task_creator__content}>
                    <button className={css.task_creator__cancel_btn} onClick={(e) => {
                        set_task_creator_state(false);
                    }}>
                         <img src={cancel_btn} alt="cancel" width='50px' height='50px'/>
                    </button>
                    <form onSubmit={new_task_handler}>
                        <input name="task_name" type="text" placeholder="Название задания..." />
                        <textarea name="task_desc" placeholder="Краткое описание задания..."></textarea>
                        <textarea name="task_text" placeholder="Текст задания..."></textarea>
                        <label htmlFor="task_deadline">Срок выполнения:</label>
                        <input name="task_deadline" type="datetime-local"/>
                        <button className={css.task_creator__create_btn} type="submit">
                            <span>Добавить</span>
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    let tasks_arr = []
    for(let task_id in list_tasks) tasks_arr.push(list_tasks[task_id]);
    let tasks =tasks_arr.map((task)=>{
        return(
            <Task key={task.id} board_data={props.board_data} lists_arr={props.lists_arr} task_data={task} on_change_tasks_tb={set_tasks_state} on_change_board_tasks_tb_state={props.on_change_board_tasks_tb_state}/>
        );
    });

    useEffect(()=>{
        if(JSON.stringify(props.board_tasks_tb_state) != JSON.stringify(tasks_tb_state)){
            console.log(props.board_tasks_tb_state, '@@@' ,tasks_tb_state);
            set_tasks_state(JSON.parse(localStorage.getItem('tasks_tb')));
        }
    });

    return(
        <div className={css.task_list__container}>
            <div className={css.task_list__header}>
                <div className={css.task_list__header_info_block}>
                    <h2>{list_data.list_name}</h2>
                    <p>{list_data.list_desc}</p>
                </div>
                <div className={css.list_editor_btn_container}>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        set_list_editor_state(true);
                    }}>
                        <span>Редактировать</span>
                    </button>
                </div>
            </div>
            <div className={css.task_creator__btn_container}>
                <button onClick={(e)=>{
                    e.preventDefault();
                    set_task_creator_state(true);
                }}>
                    <span>Добавить задание</span>
                </button>
            </div>
            {tasks}
            {list_editor()} 
            {task_creator()}
        </div>
    );
}

export default TaskList;