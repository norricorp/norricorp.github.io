<script lang="ts">
  import FilterButton from './FilterButton.svelte'
  import Todo from './Todo.svelte'
  import MoreActions from './MoreActions.svelte'
  import NewTodo from './NewTodo.svelte'
  import TodosStatus from './TodosStatus.svelte'
  import { alert } from '../stores'
  import type { TodoType } from '../types/todo.type'
  import { Filter } from '../types/filter.enum'

    export let todos: TodoType[] = []
    let newTodoName = ''
   
//    $: totalTodos = todos.length
//    $: completedTodos = todos.filter(todo => todo.completed).length
    let todosStatus: TodosStatus                   // reference to TodosStatus instance

    let newTodoId: number
    $: newTodoId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1
/*    $: {
      if (totalTodos === 0) {
        newTodoId = 1;
      } else {
        newTodoId = Math.max(...todos.map(t => t.id)) + 1;
      }
    }
*/

    function removeTodo(todo: TodoType) {
      todos = todos.filter(t => t.id !== todo.id)
      todosStatus.focus()             // give focus to status heading
      $alert = `Todo '${todo.title}' has been deleted`
    }


    function addTodo(name: string) {
      // doing this can cause problems as the array is mutated
      //todos.push({ id: newTodoId, name: newTodoName, isComplete: false })
      //todos = todos
      // doing this creates a new array
      todos = [...todos, { id: newTodoId, title: name, isComplete: false }]
      $alert = `Todo '${name}' has been added`
      // finally reset variable
      newTodoName = ''
    }

    function updateTodo(todo: TodoType) {
      const i = todos.findIndex(t => t.id === todo.id)
      if (todos[i].title !== todo.title)            $alert = `todo '${todos[i].title}' has been renamed to '${todo.title}'`
      if (todos[i].isComplete !== todo.isComplete)  $alert = `todo '${todos[i].title}' marked as ${todo.isComplete ? 'completed' : 'active'}`
      todos[i] = { ...todos[i], ...todo }
    }

    let filter: Filter = Filter.ALL
      const filterTodos = (filter: Filter, todos: TodoType[]) =>
        filter === Filter.ACTIVE ? todos.filter((t: TodoType) => !t.isComplete) :
        filter === Filter.COMPLETED ? todos.filter((t: TodoType) => t.isComplete) :
        todos
        $: {
          if (filter === Filter.ALL)               $alert = 'Browsing all todos'
          else if (filter === Filter.ACTIVE)       $alert = 'Browsing active todos'
          else if (filter === Filter.COMPLETED)    $alert = 'Browsing completed todos'
        }

    // my functions
    /*
    function removeCompletedTodos() {
      todos = todos.filter(t => t.isComplete == false)
    }

    function checkAll() {
      todos.forEach(function(item, index) {
        item.isComplete = true
//        console.log(item.name, item.isComplete, index)
      })
      todos = [...todos]
    }
    */

    const checkAllTodos = (completed: boolean) => {
      todos.forEach(t => t.isComplete = completed)
      todos = [...todos]
      $alert = `${completed ? 'Checked' : 'Unchecked'} ${todos.length} todos`
    }

    const removeCompletedTodos = () => {
      $alert = `Removed ${todos.filter(t => t.isComplete).length} todos`
      todos = todos.filter(t => !t.isComplete)
    }


  //  $: console.log('newTodoName: ', newTodoName)
</script>


<h1>Svelte To-Do list</h1>

<!-- Todos.svelte -->
<div class="todoapp stack-large">

    <!-- NewTodo -->
    <NewTodo autofocus on:addTodo={e => addTodo(e.detail)} />
  
    <!-- Filter -->
    <FilterButton bind:filter={filter}  />
  
    <!-- TodosStatus -->
    <TodosStatus bind:this={todosStatus} {todos} />
  
    <!-- Todos -->
    <ul role="list" class="todo-list stack-large" aria-labelledby="list-heading">
      {#each filterTodos(filter, todos) as todo (todo.id)}
        <li class="todo">
          <Todo todo={todo} on:update={e => updateTodo(e.detail)} on:remove={e => removeTodo(e.detail)} />
        </li>
      {:else}
        <li>Nothing to do here!</li>
      {/each}
    </ul>
  
    <hr />
  
    <!-- MoreActions -->
    <MoreActions {todos}
      on:checkAll={e => checkAllTodos(e.detail)}
      on:removeCompleted={removeCompletedTodos}
    />
  
  </div>
