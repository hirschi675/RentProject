# My Project

## Resource

**Lists**

Attributes:

* name (string)
* item1 (string)
* item2 (string)
* item3  (string)
* item4  (string)
* item5  (string)
* item6  (string)

## Schema

```MongoDB
CREATE OBJECT lists (
id INTEGER PRIMARY KEY,
name TEXT,
item1 TEXT,
item2 TEXT,
item3 TEXT,
item4 TEXT,
item5 TEXT,
item6 TEXT
);
```

## REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve list collection | GET    | /lists
Retrieve list member     | GET    | /lists/*\<id\>*
Create list member       | POST   | /movies
Update list member       | PUT    | /movies/*\<id\>*
Delete list member       | DELETE | /movies/*\<id\>*

## Hosted on Heroku
https://gentle-reef-22407.herokuapp.com/