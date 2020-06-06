## Nebs

### What's Nebs?

Nebs is a simple To-Do app with a little nice feature.  Now instead of having a long list of tasks, you can organize them into folders!  When adding a new Bookmark, you can select which folder you want to put it in as well as add a new folder.

>Live demo: https://nebs-client.now.sh

>Client Repo: https://github.com/cantuus/nebs-client



## /api/folders - GET
Retrieves all folders

**Code** : '200 OK'

```json
[
    {
    "id" : 1,
    "name": "GreenChoice"
    },
    {
    "id" : 2,
    "name": "Saleswhale"
    },
    {
    "id" : 3,
    "name": "Binance"
    },

]
```
~~____________________________________________________~~

## /api/folders - POST
Adds a new folder

**Code** : '204 No response'

**Request Format**:
```json
{
	"name": "Google"
}
```
**Success Response**
```json
{
    "id" : "4",
    "name": "Google"
}
```
~~____________________________________________________~~

## /api/folders/:folder_id - DELETE
Deletes a folder

**Code** : '204 No response'

~~____________________________________________________~~

## /api/folder/:folder_id - PATCH
Update the name of a folder

**Request Format**:
```json
{
    "id": 1,
    "name": "Teksystems"
}
```
> **Code** : `200 OK`

**Success Response**

```json
{
    "id": 1,
    "name": "Teksystems"
}
```

~~____________________________________________________~~


## /api/bookmarks - GET
Retrieves all bookmarks

**Code** : '200 OK'

```json
[
    {
        "id" : 1,
        "name": "Polish up code",
        "folder_id": 1,
        "content": "fun stuff"
    },
    {
        "id" : 2,
        "name": "Fix This",
        "folder_id": 1,
        "content": "Fix That"
    },
    {
        "id" : 3,
        "name": "Knock Knock",
        "folder_id": 2,
        "content": "Who's there"
    },
]
```
~~____________________________________________________~~

## /api/bookmarks - POST
Adds a new bookmark

**Code** : '204 No response'

**Request Format**:
```json
{
    "name": "Peek a boo",
    "folder_id": 2,
    "content": "I see you"
}
```
**Success Response**
```json
{
    "name": "Peek a boo",
    "folder_id": 2,
    "content": "I see you"
}
```
~~____________________________________________________~~

## /api/bookmarks/:bookmark_id - DELETE
Deletes a bookmark

**Code** : '204 No response'

~~____________________________________________________~~

## /api/bookmarks/:bookmark_id - PATCH
Update a bookmark

> **Code** : `200 OK`

**Request Format**:
```json
{
    "name": "Coding",
    "folder_id": 2,
    "content": "is fun"
}
```
**Success Response**

```json
{
    "name": "Coding",
    "folder_id": 2,
    "content": "is fun"
}
```
