# noobterm

A terminal menu powered by the mighty [terminal-kit](https://github.com/cronvel/terminal-kit).

## Quick start

1.  Pull down the repo and navigate to the repo folder.
2.  Run `npm install`
3.  Run `node src/index.js`
4.  Enjoy a menu!

## The script.json file and /script folder

If you run `node NOOBTERM_FOLDER/src/index.js` from a directory that has a `/script` folder noobterm will check if there is a `script.json` file there to display menu items from (there is an example script.json file in the repo). If there are other files in the `/script` folder noobterm will treat them as scripts (!!) and add them to the `/script` menu item, and when a script is selected from the menu noobterm will execute the script.
