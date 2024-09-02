import { request } from "@strapi/helper-plugin";

const todoRequests = {
  getAllTodos: async () => {
    return await request("/my-strapi-plugin/find", {
      method: "GET",
    });
  },

  addTodo: async (data) => {
    return await request(`/my-strapi-plugin/create`, {
      method: "POST",
      body: { data: data },
    });
  },

  toggleTodo: async (id) => {
    return await request(`/my-strapi-plugin/toggle/${id}`, {
      method: "PUT",
    });
  },

  editTodo: async (id, data) => {
    return await request(`/my-strapi-plugin/update/${id}`, {
      method: "PUT",
      body: { data: data },
    });
  },

  deleteTodo: async (id) => {
    return await request(`/my-strapi-plugin/delete/${id}`, {
      method: "DELETE",
    });
  },
};

export default todoRequests;