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
    const [list_tasks, set_tasks] = useState(task_filter(list_data.list_id, tasks_obj)); // filtred tasks of this lists
    

    function task_filter(list_id, tasks_obj){
        if(!tasks_obj) return null;
        let tasks_buff = {};
        for(let task_i in tasks_obj){
            if(tasks_obj[task_i].list_id == list_id)
            {
                tasks_buff[list_id] = tasks_obj[list_id];
            }
        }
    }
    //сделать извлечение данных задач и само их добавление
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
        if(list_tasks){
            tasks_tb_new = {...list_tasks};
            
        }
        else{

        }
    }

    console.log('list data state: ', list_data);

    return(
        <div className={css.task_list__container}>
            
        </div>
    );
}

export default TaskList;