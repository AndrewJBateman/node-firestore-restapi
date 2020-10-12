'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./firestore');

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * GET /api/books
 *
 * Retrieve a page of books (up to ten at a time).
 */
router.get('/', async (req, res) => {
  const {books, nextPageToken} = await db.list(10, req.query.pageToken);
  res.json({
    items: books,
    nextPageToken,
  });
});

/**
 * POST /api/books
 *
 * Create a new book.
 */
router.post('/', async (req, res) => {
  const book = await db.create(req.body);
  res.json(book);
});

/**
 * GET /api/books/:id
 *
 * Retrieve a book.
 */
router.get('/:book', async (req, res) => {
  const book = await db.read(req.params.book);
  res.json(book);
});

/**
 * PUT /api/books/:id
 *
 * Update a book.
 */
router.put('/:book', async (req, res) => {
  const book = await db.update(req.params.book, req.body);
  res.json(book);
});

/**
 * DELETE /api/books/:id
 *
 * Delete a book.
 */
router.delete('/:book', async (req, res) => {
  await db.delete(req.params.book);
  res.status(200).send('OK');
});

module.exports = router;
