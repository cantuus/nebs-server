const path = require('path');
const express = require('express');
const xss = require('xss');
const BookmarksService = require('./bookmarks-service');
const bookmarksRouter = express.Router();
const jsonParser = express.json();

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    name: xss(bookmark.name),
    folder_id: bookmark.folder_id,
    content: xss(bookmark.content)
});

bookmarksRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(notes => {
                res.json(notes.map(serializeBookmark))
            })
            .catch(next)
    })


module.exports = bookmarksRouter;