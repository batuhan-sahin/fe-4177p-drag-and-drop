import React, { useEffect, useRef, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";

import { nanoid } from "nanoid";
import "./App.css";

interface Todo {
  id: string;
  content: string;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentTodoId, setCurrentTodoId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedTodos = Array.from(todos);
    const [removed] = reorderedTodos.splice(source.index, 1);
    reorderedTodos.splice(destination.index, 0, removed);

    setTodos(reorderedTodos);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const handleKeyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleAddTodo = () => {
    if (!input.trim()) {
      alert("Please enter To-Do!");
      return;
    }
    const newTodo: Todo = {
      id: nanoid(),
      content: input,
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const handleDeleteTodo = (id: string) => {
    const uptadedTodo = todos.filter((todo) => todo.id !== id);
    setTodos(uptadedTodo);
  };

  const handleEditTodo = (id: string) => {
    const todoEdit = todos.find((todo) => todo.id === id);
    if (todoEdit) {
      setEditedContent(todoEdit.content);
      setCurrentTodoId(id);
      setIsModalOpen(true);
    }
  };

  const handleSaveEdit = () => {
    if (currentTodoId && editedContent.trim()) {
      const updatedTodos = todos.map((todo) =>
        todo.id === currentTodoId ? { ...todo, content: editedContent } : todo
      );
      setTodos(updatedTodos);
      setIsModalOpen(false);
      setCurrentTodoId(null);
      setEditedContent("");
    }
  };
  const handleKeyInputModal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    }
  }; // The function works but get a warning on console. Will be checked later.

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditedContent("");
    setCurrentTodoId(null);
  };

  useEffect(() => {
    inputRef.current?.focus();
    console.log(todos);
  }, [todos]);

  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={input}
          ref={inputRef}
          onKeyDown={handleKeyInput}
          onChange={handleInputChange}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided: DroppableProvided) => (
            <ul
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {todos.length === 0 ? (
                <p>Your To-Do list is empty</p>
              ) : (
                todos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided: DraggableProvided) => (
                      <li
                        className="todo-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {todo.content}
                        <div className="button-groups">
                          <button onClick={() => handleEditTodo(todo.id)}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteTodo(todo.id)}>
                            delete
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Todo</h2>
            <input
              type="text"
              value={editedContent}
              onKeyDown={handleKeyInputModal}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="button-groups">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
