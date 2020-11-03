import React from "react"
import TodoList from "./TodoList"
import Header from "./Header"
import InputTodo from "./InputTodo"
import axios from "axios";


const apiKey = process.env.REACT_APP_TODO_SHEETS_KEY;

const sheetID = process.env.REACT_APP_TODO_SHEETS_ID;

const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values:batchGet?ranges=todo_items&majorDimension=ROWS&key=${apiKey}`;
//const url = `https://jsonplaceholder.typicode.com/todos?_limit=10`

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

        //okay, check out sheety.co
        
        //axios.get("https://jsonplaceholder.typicode.com/todos?_limit=10")
            //.then(response => this.setState({ todos: response.data }));

            //when using the sheets data I need to go through and get the
            //values by reading through each set (looping)
            fetch(url)
              .then(response => response.json())
              .then(data => {
                let batchRowValues = data.valueRanges[0].values;

                const rows = [];
                for (let i = 1; i < batchRowValues.length; i++) {
                  let rowObject = {};
                  for (let j = 0; j < batchRowValues[i].length; j++) {
                      if (j < 2) {
                        rowObject[batchRowValues[0][j]] = parseInt(batchRowValues[i][j]);
                      } else if (j > 2){
                        rowObject[batchRowValues[0][j]] = Boolean(parseInt(batchRowValues[i][j]));
                      } else {
                        rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
                      }
                    
                    //console.log(rowObject);
                  }
                  rows.push(rowObject);
                }

                  //const theData = 
                  //console.log(rows);
                this.setState({ todos: rows })
              })
              .catch(error => {console.log(error);
            });
              //.then(data => {

        //Notes for me: I am just going to use the Sheets API for this
        //I am most likely running up against the limits of the shared
        //connection for Sheetson, thus the 403.
/*         const fetch = require('isomorphic-fetch');
        fetch("https://api.sheetson.com/v2/sheets/todo_items", {
            headers: {
                "Authorization" : "Bearer V9bK1R-7XHm-18UQEre_sHp8Quph_4nF1VM5-qa1FjIYSTGGN8fAk6sbWLg",
                "X-Spreadsheet-Id" : "1EYQc1ffpp1ZCiynjufzVcGKP4qosztd3xunPe3L9SuM"
            }
        }).then(r => r.json())
        .then(result => this.setState({ todos: result })) */
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