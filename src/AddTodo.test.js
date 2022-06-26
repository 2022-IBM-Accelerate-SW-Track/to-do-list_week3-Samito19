import { render, screen, fireEvent, getByTestId } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import App from "./App";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("test that App component doesn't render dupicate Task", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  const tasks_number = screen.getAllByText(/History Test/i);
  expect(tasks_number.length < 2).toBe(true);
});

test("test that App component doesn't add a task without task name", () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole("button", { name: /Add/i });
  const dueDate = "05/30/2023";
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
});

test("test that App component doesn't add a task without due date", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const addButton = screen.getByRole("button", { name: /Add/i });
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(addButton);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
});

test("test that App component can be deleted thru checkbox", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const addButton = screen.getByRole("button", { name: /Add/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const dueDate = "05/30/2023";
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(addButton);
  const checkTask = screen.getByRole("checkbox");
  fireEvent.click(checkTask);
  const check = screen.getByText(/You have no todo's left/i);
  expect(check).toBeInTheDocument();
});

test("test that App component renders different colors for past due events", () => {
  render(<App />);
  const inputTask = screen.getByRole("textbox", { name: /Add New Item/i });
  const addButton = screen.getByRole("button", { name: /Add/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");

  const dueDate = "05/30/2025";
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.click(addButton);

  const dueDate2 = "05/30/2021";
  fireEvent.change(inputDate, { target: { value: dueDate2 } });
  fireEvent.change(inputTask, { target: { value: "Math Test" } });
  fireEvent.click(addButton);

  const historyCheck = screen.getByTestId(/History Test/i);
  const mathCheck = screen.getByTestId(/Math Test/i);

  expect(historyCheck).toHaveStyle(`background-color: white`);
  expect(mathCheck).toHaveStyle(`background-color: red`);
});
