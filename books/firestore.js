'use strict';

// [START bookshelf_firestore_client]
const {Firestore} = require('@google-cloud/firestore');

const db = new Firestore();
const collection = 'Book';

// [END bookshelf_firestore_client]

// Lists all books in the database sorted alphabetically by title.
async function list(limit, token) {
  const snapshot = await db
    .collection(collection)
    .orderBy('title')
    .startAfter(token || '')
    .limit(limit)
    .get();

  if (snapshot.empty) {
    return {
      books: [],
      nextPageToken: false,
    };
  }
  const books = [];
  snapshot.forEach((doc) => {
    let book = doc.data();
    book.id = doc.id;
    books.push(book);
  });
  const q = await snapshot.query.offset(limit).get();

  return {
    books,
    nextPageToken: q.empty ? false : books[books.length - 1].title,
  };
}

// Creates a new book or updates an existing book with new data.
async function update(id, data) {
  let ref;
  if (id === null) {
    ref = db.collection(collection).doc();
  } else {
    ref = db.collection(collection).doc(id);
  }

  data.id = ref.id;
  data = {...data};
  await ref.set(data);
  return data;
}

async function create(data) {
  return await update(null, data);
}

// [START bookshelf_firestore_client_get_book]
async function read(id) {
  const doc = await db.collection(collection).doc(id).get();

  if (!doc.exists) {
    throw new Error('No such document!');
  }
  return doc.data();
}
// [END bookshelf_firestore_client_get_book]

async function _delete(id) {
  await db.collection(collection).doc(id).delete();
}

module.exports = {
  create,
  read,
  update,
  delete: _delete,
  list,
};
