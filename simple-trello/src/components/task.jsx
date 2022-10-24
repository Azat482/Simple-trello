import React from "react";
import { useState } from "react";
import css from './styles/task.module.css'
import cancel_btn from './images/cancel.svg'
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";


function Task(props){
    
    let tasks_tb = JSON.parse(localStorage.getItem('tasks_tb'));
    const [task_editor_state, set_task_edotor_state] = useState(false);
    const [task_info_full_state, set_task_info_full_state] = useState(false);
    const [task_data, set_task_data] = useState(props.task_data);
    const task_full_info_ref = `/board?board-id=${props.board_data.id}&board-name=${props.board_data.name}&task-id=${task_data.id}&task-name=${task_data.name}`;
    const board_ref = `/board?board-id=${props.board_data.id}&board-name=${props.board_data.name}`;
    const task_navigator = useNavigate();
    let [task_search_params, set_task_search_params] = useSearchParams();

    const update_tasks_db = (task_tb_upd) =>{
        localStorage.setItem('tasks_tb', JSON.stringify(task_tb_upd));
        props.on_change_tasks_tb(task_tb_upd);
        props.on_change_board_tasks_tb_state(task_tb_upd);
    }

    const delete_task_db = () =>{
        tasks_tb = JSON.parse(localStorage.getItem('tasks_tb'));
        delete tasks_tb[task_data.id];
        localStorage.setItem('tasks_tb', JSON.stringify(tasks_tb));
        props.on_change_board_tasks_tb_state(tasks_tb);
    }

    const task_delete_handler = (e) =>{
        e.preventDefault();
        delete_task_db();
        set_task_edotor_state(false);
        props.on_change_tasks_tb(tasks_tb);
    }

    const task_editor_handler = (e)=>{
        tasks_tb = JSON.parse(localStorage.getItem('tasks_tb'));
        e.preventDefault();
        const task_data_form_upd = new FormData(e.target);
        const task_obj_upd = {
            id: task_data.id,
            list_id: task_data_form_upd.get('task_replacer'),
            name: task_data_form_upd.get('task_name_new'),
            description: task_data_form_upd.get('task_desc_new'),
            task_text: task_data_form_upd.get('task_text_new'),
            datetime: task_data.datetime,
            deadline: task_data_form_upd.get('task_deadline_new'),
        };
        console.log('new list_id', task_data_form_upd.get('task_replacer'));
        tasks_tb[task_obj_upd.id] = task_obj_upd;
        set_task_data(task_obj_upd);
        set_task_edotor_state(false);
        update_tasks_db(tasks_tb);    
    }

    const task_info_full = () =>{
        if(
            task_search_params.get('task-id') != task_data.id 
            &&
            task_search_params.get('task-name') != task_data.name
        ) return null;
        return(
            <div className={css.task_info_full__container}>
                <div className={css.task_info_full__content}>
                    <button className={css.task_info_full__cancel_btn} onClick={(e) => {
                        e.preventDefault();
                        set_task_info_full_state(false);
                        task_navigator(board_ref);
                    }}>
                        <img src={cancel_btn} alt="cancel" width='50px' height='50px' />
                    </button>
                    <div className={css.task_info__block}>
                        <h2 className={css.task_name}>{task_data.name}</h2>
                        <p  className={css.task_desc}>{task_data.description}</p>
                        <span className={css.task_info__sep_line}></span>
                        <p  className={css.task_text}>{task_data.task_text}</p>
                        <p  className={css.task_deadline}>{task_data.deadline}</p>
                    </div>
                    <button className={css.task_full_info__edit_btn} onClick={(e => {
                        e.preventDefault();
                        set_task_edotor_state(true);
                    })}>
                        <span>Редактировать</span>
                    </button>
                </div>
            </div>
        );
    }
    
    const tasks_lists_selects = ()=>{
        let select_items = props.lists_arr.map((list)=>{
            return (
                <option key={list.id} name={list.name} id={list.id} value={list.id}>{list.name}</option>
            );
        });
        return select_items;
    }

    const task_editor = () =>{
        if(!task_editor_state) return null;
        return(
            <div className={css.task_editor__container}>
                <div className={css.task_editor__content}>
                    <button className={css.task_editor__cancel_btn} onClick={(e) => {
                        e.preventDefault();
                        set_task_edotor_state(false);
                    }}>
                        <img src={cancel_btn} alt="cancel" width='50px' height='50px' />
                    </button>
                    <form onSubmit={task_editor_handler}>
                        <label htmlFor="task_name_new">Название задания:</label>
                        <input name="task_name_new" type="text" placeholder="Название..." defaultValue={task_data.name} />
                        <label htmlFor="task_desc_new">Краткое описание задания:</label>
                        <textarea name="task_desc_new" placeholder="Описание..." defaultValue={task_data.description}></textarea>
                        <label htmlFor="task_text_new">Полное описание задания:</label>
                        <textarea name="task_text_new" placeholder="Полное описание..." defaultValue={task_data.task_text}></textarea>
                        <label htmlFor="task_deadline_new">Срок выполнения задания:</label>
                        <input name="task_deadline_new" type="datetime-local" defaultValue={task_data.deadline} />
                        <label htmlFor="task_replacer">Перевести задание в другой список:</label>
                        <select name="task_replacer" defaultValue={task_data.list_id}>
                            {tasks_lists_selects()}
                        </select>
                        <div className={css.task_editor__option_btns}>
                            <button className={css.task_editor__save_btn} type="submit">
                                <span>Сохранить</span>
                            </button>
                            <button className={css.task_editor__delete_btn} onClick={task_delete_handler}>
                                <span>Удалить</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>    
        );
    }

    return(
        <div className={css.task__container} key={task_data.id}>
            <div className={css.task_info__container}>
                <h3 className={css.task_info_name}>{task_data.name}</h3>
                <p className={css.task_info_desc}>{task_data.description}</p>
                <p className={css.task_info_deadline}><span>Сделать до: </span>{task_data.deadline}</p>
            </div>
            <div className={css.task__options_btns_container}>
                <button onClick={(e => {
                    e.preventDefault();
                    set_task_edotor_state(true);
                })}>
                    <span>Редактировать</span>
                </button>
                <button onClick={(e) => {
                        e.preventDefault();
                        set_task_info_full_state(true);
                        task_navigator(task_full_info_ref);
                    }}>
                    <span>Показать</span>
                </button>
                

            </div>
            {task_editor()}
            {task_info_full()}
        </div>
    );
}

export default Task;