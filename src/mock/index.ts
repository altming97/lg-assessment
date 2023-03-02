import { createServer } from "miragejs";

import data from "./data.json";

createServer({
  routes() {
    this.namespace = "api";

    this.get("/posts", (schema, request) => {
      const req = request.queryParams;
      const count = parseInt(req.count) || 10;
      const take = parseInt(req.take);
      let filteredData = data.posts;

      if (req.filter) {
        filteredData = data.posts.filter((datum) =>
          datum.categories.map((d) => d.name).includes(req.filter),
        );
      }

      return {
        data: filteredData.slice(take ? count - take : 0, count),
        total: filteredData.length,
      };
    });

    // Get single for detail page
    this.get("/posts/:id", (schema, request) => {
      const id = request.params.id;
      const detail = data.posts.find((datum) => datum.id === id);

      return detail ?? null;
    });

    // Get filters, prefer hardcode from backend
    this.get("/category", () => {
      let unique = new Set();
      data.posts.forEach((datum) => {
        for (let i = 0; i < datum.categories.length; i++) {
          unique.add(datum.categories[i].name);
        }
      });

      return Array.from(unique);
    });
  },
});
