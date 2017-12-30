
/*

[X] C
[X] R
[X] U
[X] D

*/

import React, { Component } from 'react'
import './App.css'

import randomString from 'random-string'
import moment from 'moment'
import 'moment/locale/sv'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

moment.locale('sv')

class ListItem extends Component {

  render() {

    const task = this.props.done ?
      <strike>{this.props.task}</strike>
      : this.props.task
    
    const title = (
      <span
        onClick={e => this.props.toggleDone(this.props.id)}
      >{task}</span>
    )

    const card = (
      <Card>
        <CardHeader
          title={title}
          subtitle={
            this.props.due && !this.props.done &&
            moment(this.props.due).fromNow()
          }
          actAsExpander={false}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          {this.props.note}
        </CardText>
        <CardActions expandable={true}>
          <FlatButton label="Ta bort"
            onClick={e => this.props.delete(this.props.id)}
          />
          <FlatButton label="Ändra"
            onClick={e => this.props.edit(this.props.id)}
          />
        </CardActions>
      </Card>

    )
    return (
      <Paper
        style={{ margin: "10px 0px" }}
        zDepth={1}
        children={card}
      />
    )
  }
}

class AddOrEditTodo extends Component {

  constructor(props) {
    super(props)

    this.state = {
      todo: props.todo || {
        task: '',
        done: false,
        due: null,
        id: randomString(),
        note: '',
        createdAt: new Date()
      }
    }
  }

  render() {

    const actions = [
      <FlatButton label="Avbryt"
        primary={true}
        onClick={this.props.cancel}
      />,
      <FlatButton label={this.props.todo ? "Spara" : "Lägg till"}
        disabled={true && !this.state.todo.task}
        primary={true}
        onClick={e => this.props.submit(this.state.todo)}
      />
    ]

    return (
      <Dialog title="Lägg till ny"
        modal={true}
        open={true}
        actions={actions}
      >
        <TextField
          hintText="Köp kaffe, Ring Justina..."
          floatingLabelText="Att göra"
          fullWidth={true}
          value={this.state.todo.task && this.state.todo.task}
          onChange={e => this.setState({ todo: { ...this.state.todo, task: e.target.value } })}
        />
        <TextField
          hintText="Ytterligare anteckningar om punkten..."
          floatingLabelText="Anteckningar"
          fullWidth={true}
          multiLine={true}
          rows={3}
          value={this.state.todo.note && this.state.todo.note}
          onChange={e => this.setState({ todo: { ...this.state.todo, note: e.target.value } })}
        />
      </Dialog>
    )
  }
}

class TodoList extends Component {

  constructor(props) {
    super(props)

    this.mainStyle = {
      "maxWidth": "800px",
      "margin": "0 auto",
      "display": "flex",
      "flexDirection": "column",
      "padding": "0 10px",
      "paddingTop": "100px",
      "overflowY": "auto"
    }

    this.state = {
      addingNew: false,
      editing: false,
      todos: [
        {
          task: 'Köp mjölk',
          done: false,
          due: null,
          id: randomString(),
          note: null,
          createdAt: new Date()
        },
        {
          task: 'Ring mormor',
          done: false,
          due: new Date('2018-01-02 10:10:00'),
          id: randomString(),
          note: 'Kom ihåg att fråga om trädgården',
          createdAt: new Date('2017-12-25 21:03:22')
        }
      ]
    }
  }

  addTodo = (todo) => {
    this.setState({
      todos: this.state.todos.concat([todo]),
      addingNew: false
    })
  }

  deleteTodo = (id) => {
    this.setState({
      todos: this.state.todos.filter(todo => {
        return todo.id !== id
      })
    })
  }

  setEditingTodo = (id) => {
    this.setState({
      editing: true,
      editingTodoId: id
    })
  }

  editTodo = (editedTodo) => {
    this.setState({
      todos: this.state.todos.map(todo => {
        return editedTodo.id === todo.id ? editedTodo : todo
      }),
      editing: false,
      editingTodoId: null
    })
  }

  toggleDone = (id) => {
    this.setState({
      todos: this.state.todos.map(todo => {
        return todo.id === id ? (
          {
            ...todo,
            done: !todo.done
          }
        ) : todo
      })
    })
  }

  listTodos = (todos) => {

    function sortByDateCreated(a, b) {
      return b.createdAt - a.createdAt
    }
    function sortByDone(a, b) {
      return a.done - b.done
    }

    const sorted = todos
      .sort(sortByDateCreated)
      .sort(sortByDone)

    return todos.map(todo => {
      return (
        <ListItem
          task={todo.task}
          done={todo.done}
          due={todo.due}
          note={todo.note}
          key={todo.id}
          id={todo.id}
          delete={this.deleteTodo}
          edit={this.setEditingTodo}
          toggleDone={this.toggleDone}
        />
      )
    })
  }

  render() {

    return (
      <div style={this.mainStyle}>
        <RaisedButton primary={true}
          label="Lägg till ny"
          style={{ "alignSelf": "flex-end" }}
          onClick={e => this.setState({ addingNew: true })}
        />
        {this.listTodos(this.state.todos)}
        {
          this.state.addingNew &&
          <AddOrEditTodo
            submit={this.addTodo}
            cancel={() => this.setState({ addingNew: false })}
          />
        }
        {
          this.state.editing &&
          <AddOrEditTodo
            todo={this.state.todos.find(todo => {
              return todo.id === this.state.editingTodoId
            })}
            submit={this.editTodo}
            cancel={() => this.setState({ editing: false })}
          />
        }
      </div>
    )
  }
}




class App extends Component {
  render() {
    return (
      // <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
      <MuiThemeProvider>
        <TodoList />
      </MuiThemeProvider>
    )
  }
}

export default App
