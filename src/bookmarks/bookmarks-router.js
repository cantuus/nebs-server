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
    .post(jsonParser, (req, res, next) => {
        const { name, folder_id, content } = req.body;
        const newBookmark = { name, folder_id, content }

        for (const [key, value] of Object.entries(newBookmark)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${bookmark.id}`))
                    .json(serializeBookmark(bookmark))
            })
            .catch(next)
    });


module.exports = bookmarksRouter;