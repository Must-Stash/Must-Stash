# Must-Stash (Extension)

MustStash is a google chrome extension that preserves and analyzes your query terms and results as you browse. On click, the MustStash will display the site link most relevant to you and your search input on the google search bar.

## Installation
Must-Stash requires [Node.js](https://nodejs.org/) v4+ to run.
```sh
- Open your favourite Terminal and run these commands: 

$ git clone [git@github.com:Must-Stash/Must-Stash-Extension.git] 
$ cd Must-Stash-Extension
$ npm i -d

- open four terminal tabs, on each, please run these commands:

1. First Tab:
    $ cd elasticsearch
    $ bin/elasticsearch
    
2. Second Tab:
    $ redis-server
    
3. Third Tab:
    $ npm run webpack
    
4. Fourth Tab:
    $ nodemon server.js
```
After this, it's pretty easy to unpack and run on Chrome:

- Ensure that the Developer mode checkbox in the top right-hand corner is checked.
- Click Load unpacked extension… to pop up a file-selection dialog.
- Navigate to the directory in which your Must-Stash files live, and select it.

### Example

> video goes here

### Development
Want to contribute? Great!
Must Stash uses a number of open source projects to work properly:
* [node.js] - evented I/O for the backend
* [React] - HTML enhanced for web apps!
* [Express] - fast node.js network app framework [@tjholowaychuk]

You can contribute to both parts of Must-Stash:

The Extension component: 
[https://github.com/Must-Stash/Must-Stash-Extension]
And the Server component: 
[https://github.com/Must-Stash/Must-Stash-Server]

License
----

MIT

