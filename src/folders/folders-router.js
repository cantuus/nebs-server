const path = require('path');
const express = require('express');
const xss = require('xss');
const FoldersService = require('./folders-service');
const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolders = folder => ({
    id: folder.id,
    name: xss(folder.name)
});

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getAllFolders(knexInstance)
            .then(folders => {
                res.json(folders.map(serializeFolders))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body;
        const newFolder = { name };

        if (!name) {
            return res.status(400).json({
                error: {
                    message: 'Missing Folder name'
                }
            });
        }

        console.log('tell me now');
        console.log(newFolder);

        FoldersService.insertFolder(
            req.app.get('db'),
            newFolder
        )
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${folder.id}`))
                    .json(serializeFolders(folder))
            })
            .catch(next)
    });

module.exports = foldersRouter;