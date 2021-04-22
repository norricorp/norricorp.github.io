import { writable } from 'svelte/store'
import { localStore } from './localStore'
import type { TodoType } from './types/todo.type'

export const alert = writable('Welcome to the To-Do list app!')

const initialTodos: TodoType[] = [
    { id: 1, title: 'Visit MDN web docs', completed: true },
    { id: 2, title: 'Complete the Svelte Tutorial', completed: false },
  ]
  
  export const todos = localStore<TodoType[]>('mdn-svelte-todo', initialTodos)