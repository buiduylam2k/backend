## Design database

## 1. Users

- id
- email
- password
- created at
- updated at
- isDeleted
- ...


## 2. Blogs

- id
- title
- content (ck editor)
- created at
- updated at
- isDeleted
- author ( user )
- tag

## Tags

- id
- name
- created at
- updated at
- isDeleted
- author ( user )

## 3. Posts

- id
- content (ck editor)
- banner
- created at
- updated at
- isDeleted
- comments
- author ( user )
- views
- tag

## 4. Comments

- id
- content
- created at
- updated at
- isDeleted
- author ( user )
- postId