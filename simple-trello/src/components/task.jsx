import React from "react";
import { useState } from "react";
import css from './styles/task.module.css'

function Task(props){
    
    let tasks_tb = JSON.parse(localStorage.getItem('tasks_tb'));
    const [task_editor_state, set_task_edotor_state] = useState(false);
    const [task_data, set_task_data] = useState(props.task_data);

    const update_tasks_db = (task_tb_upd) =>{
        localStorage.setItem('tasks_tb', JSON.stringify(task_tb_upd));
        props.on_change_tasks_tb(task_tb_upd);
    }

    const delete_task_db = () =>{
        delete tasks_tb[task_data.id];
        localStorage.setItem('tasks_tb', JSON.stringify(tasks_tb));
        props.on_change_tasks_tb(tasks_tb);
    }

    const task_delete_handler = (e) =>{
        e.preventDefault();
        delete_task_db();
        set_task_edotor_state(false);
    }

    const task_editor_handler = (e)=>{
        e.preventDefault();
        const task_data_form_upd = new FormData(e.target);
        const task_obj_upd = {
            id: task_data.id,
            list_id: task_data.list_id,
            name: task_data_form_upd.get('task_name_new'),
            description: task_data_form_upd.get('task_desc_new'),
            task_text: task_data_form_upd.get('task_text_new'),
            datetime: task_data.datetime,
            deadline: task_data_form_upd.get('ask_deadline_new'),
        };
        tasks_tb[task_obj_upd.id] = task_obj_upd;
        update_tasks_db(tasks_tb);
        set_task_data(task_obj_upd);
        set_task_edotor_state(false);
    }
    

    const task_editor = () =>{
        if(!task_editor_state) return null;
        return(
            <div className={css.task_editor__container}>  
                <button onClick={(e)=>{
                    e.preventDefault();
                    set_task_edotor_state(false);
                }}>
                    <span>cancel</span>
                </button>
                <form onSubmit={task_editor_handler}>
                    <input name="task_name_new" type="text" placeholder="Edit name" defaultValue={task_data.name}/>
                    <textarea name="task_desc_new" id="" cols="30" rows="10" placeholder="Edit decription" defaultValue={task_data.description}></textarea>
                    <textarea name="task_text_new" id="" cols="30" rows="10" placeholder="Edit text" defaultValue={task_data.task_text}></textarea>
                    <input name="task_deadline_new" type="datetime-local" defaultValue={task_data.deadline}/>
                    <button type="submit">
                        <span>save</span>
                    </button>
                </form>
                <button onClick={task_delete_handler}>
                    <span>Delete task</span>
                </button>
            </div>    
        );
    }

    return(
        <div className={css.task__container}>
            <h1>TAASK</h1>
            <h1>{task_data.name}</h1>
            <h2>{task_data.description}</h2>
            <p>{task_data.task_text}</p>
            <p>{task_data.deadline}</p>
            <button onClick={(e=>{
                e.preventDefault();
                set_task_edotor_state(true);
            })}>
                <span>Edit task</span>
            </button>
            {task_editor()}
        </div>
    );
}

export default Task;