import React, {useState, useEffect} from "react";
import css from './styles/task_list.module.css';

function TaskList(props){
    const list_data_props = props.list_data;
    const tasks_obj = JSON.parse(localStorage.getItem('tasks_tb')); //all tasks
    const [list_data, set_list_data] = useState(
        {
            list_id: list_data_props.id,
            list_board_id: list_data_props.name,
            list_name: list_data_props.name,
            list_desc: list_data_props.description,
            list_datetime: list_data_props.datetime
        }
    );
    const [list_tasks, set_tasks] = useState(task_filter(list_data.list_id, tasks_obj)); // filtred tasks of this lists, only uses in rendering
    

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
        console.log('filter result: ', tasks_buff);
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
        if(tasks_obj){
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

    const new_task_handler = (e) =>{
        e.preventDefault();
        const form_data = new FormData(e.target);
        const task_name = form_data.get('task_name');
        const task_desription = form_data.get('task_desc');
        const task_text = form_data.get('task_text');
        const task_deadline = form_data.get('task_deadline');
        add_task_db(task_name, task_desription, task_text, task_deadline);
    }

    let tasks_arr = []
    for(let task_id in list_tasks) tasks_arr.push(list_tasks[task_id]);
    let tasks =tasks_arr.map((task)=>{
        return(
        <div className={css.list_items_wrapper} key={task.id}>
            <h1>{task.name}</h1>
        </div>
        );
    });

    return(
        <div className={css.task_list__container}>
            {list_data.list_name}
            <div>
                <h1>TASKS CREATOR</h1>
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
            {tasks}
        </div>
    );
}

export default TaskList;