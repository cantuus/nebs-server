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
            .then(bookmarks => {
                res.json(bookmarks.map(serializeBookmark))
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


bookmarksRouter
    .route('/:id')
    .all((req, res, next) => {
        BookmarksService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(bookmark => {
                if (!bookmark) {
                    return res.status(404).json({
                        error: { message: `Bookmark doesn't exist` }
                    })
                }

                res.bookmark = bookmark
                next()
                res.json(serializeBookmark(bookmark))
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeBookmark(res.bookmark))
    })
    .delete((req, res, next) => {
        BookmarksService.deleteBookmark(
            req.app.get('db'),
            req.params.id
        )
            .then(bookmarks => {
                res.status(204).json(bookmarks)
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, folder_id, content } = req.body
        const bookmarkToUpdate = { name, folder_id, content }

        const numberOfValues = Object.values(bookmarkToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain name, folder_id, and content`
                }
            })

        BookmarksService.updateBookmark(
            req.app.get('db'),
            req.params.id,
            bookmarkToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)

    });


module.exports = bookmarksRouter;