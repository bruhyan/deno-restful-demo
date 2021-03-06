import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { getNotes, createNote, getSingleNote, updateNote, deleteNote } from './route.ts';

const router = new Router();
router.get('/', (ctx) => {
  ctx.response.body = 'Welcome to notes API';
})
  .get('/notes', getNotes)
  .get('/notes/:id', getSingleNote)
  .post('/notes', createNote)
  .put('/notes/:id', updateNote)
  .delete('/notes/:id', deleteNote)
  ;

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

// deno run --allow-net --allow-write --allow-read --allow-plugin --unstable server.ts
app.listen({ port: 8000 });
console.log('Server is up and running at port 8000');