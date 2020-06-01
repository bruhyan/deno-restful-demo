import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import db from './mongodb.ts';

const notesCollection = db.collection('notes');

const getNotes = async (ctx: RouterContext) => {
  const notes = await notesCollection.find();
  ctx.response.body = notes;
}

const createNote = async (ctx: RouterContext) => {
  const { value: { title, body } } = await ctx.request.body();
  const note: any = {
    title,
    body,
    date: new Date()
  };
  const noteId = await notesCollection.insertOne(note);

  note._id = noteId;
  ctx.response.status = 201;
  ctx.response.body = note;
}

const getSingleNote = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  const note = await notesCollection.findOne({ _id: { $oid: id } }); //make sure id is passed in as object, check mongodb docs
  ctx.response.body = note;
}

const updateNote = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  const { value: { title, body } } = await ctx.request.body();
  try {
    const updateData: any = {
      title,
      body,
    };
    const result = await notesCollection.updateOne({ _id: { $oid: id } }, {
      $set: updateData
    }); //make sure id is passed in as object, check mongodb docs

    if (!result.modifiedCount) {
      ctx.response.status = 404;
      ctx.response.body = { result: 'Note does not exist' };
      return;
    }
  } catch (e) {
    ctx.response.status = 500;
    ctx.response.body = { result: "Unknown error" };
    return;
  }
  
  ctx.response.body = await notesCollection.findOne({_id: {$oid: id}});
}

const deleteNote = async (ctx: RouterContext) => {
  const id = ctx.params.id;
  const count = await notesCollection.deleteOne({ _id: { $oid: id } }); //make sure id is passed in as object, check mongodb docs
  if (!count) {
    ctx.response.status = 404;
    ctx.response.body = { result: 'Note does not exist' };
    return;
  }
  ctx.response.status = 204;
}

export { getNotes, createNote, getSingleNote, updateNote, deleteNote };