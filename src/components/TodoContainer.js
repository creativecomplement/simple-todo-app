import React from "react"
import TodoList from "./TodoList"
import Header from "./Header"
import InputTodo from "./InputTodo"
import axios from "axios";

class TodoContainer extends React.Component{
    state = {
        todos: [
            {
                id: 1,
                title: "Setup development environment",
                completed: true
            },
            {
                id: 2,
                title: "Develop website and add content",
                completed: false
            },
            {
                id: 3,
                title: "Deploy to live server",
                completed: false
            }
        ]
    };

    handleChange = id => {
        this.setState({
            todos: this.state.todos.map(todo => {
                if (todo.id ===id) {
                    todo.completed = !todo.completed;
                }
                return todo;
            })
        })
    }

    delTodo = id => {
            axios
                .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
                .then(reponse =>
                this.setState({
                    todos: [
                    ...this.state.todos.filter(todo => {
                        return todo.id !== id
                    }),
                    ],
                })
                )
            }

    addTodoItem = title => {
        axios
            .post ("https://jsonplaceholder.typicode.com/todos/",
            {
            title: title,
            complete: false 
        })
        .then(response =>
            this.setState({
                todos: [...this.state.todos, response.data],
            })
        )
    };

    componentDidMount() {
        //axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10")
            //.then(response => this.setState({ todos: response.data }));
        const fetch = require('isomorphic-fetch');
        fetch("https://api.sheetson.com/v2/sheets/todo_items", {
            headers: {
                "Authorization" : "Bearer V9bK1R-7XHm-18UQEre_sHp8Quph_4nF1VM5-qa1FjIYSTGGN8fAk6sbWLg",
                "X-Spreadsheet-Id" : "1EYQc1ffpp1ZCiynjufzVcGKP4qosztd3xunPe3L9SuM"
            }
        }).then(r => r.json())
        .then(result => this.setState({ todos: result }))
    }

    render() {
        return(
            <div className="container">
                <Header />
                <InputTodo addTodoProps={this.addTodoItem} />
                <br></br>
                <TodoList todos={this.state.todos}
                handleChangeProps={this.handleChange}
                deleteTodoProps={this.delTodo} />
            </div>
        )
    }
}
export default TodoContainer