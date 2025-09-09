import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getTodos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("todos").order("desc").collect();
  },
});

export const addTodo = mutation({
  args: {
    text: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, { text }) => {
    const todoId = await ctx.db.insert("todos", { text, isCompleted: false });

    return todoId;
  },
});

export const toggleTodo = mutation({
  args: {
    todoId: v.id("todos"),
  },
  handler: async (ctx, { todoId }) => {
    const todo = await ctx.db.get(todoId);

    if (!todo) {
      throw new ConvexError("Todo not found");
    }

    await ctx.db.patch(todoId, { isCompleted: !todo.isCompleted });
  },
});

export const deleteTodo = mutation({
  args: {
    todoId: v.id("todos"),
  },
  handler: async (ctx, { todoId }) => {
    const todo = await ctx.db.get(todoId);

    if (!todo) {
      throw new ConvexError("Todo not found");
    }

    await ctx.db.delete(todoId);
  },
});

export const updateTodo = mutation({
  args: {
    todoId: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, { todoId, text }) => {
    const todo = await ctx.db.get(todoId);

    if (!todo) {
      throw new ConvexError("Todo not found");
    }

    await ctx.db.patch(todoId, { text });
  },
});

export const clearAllTodos = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();

    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }

    return { deletedCount : todos.length };
  },
});
