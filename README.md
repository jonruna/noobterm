# noobterm

A terminal menu powered by the mighty [terminal-kit](https://github.com/cronvel/terminal-kit).

## Quick start

1.  Pull down the repo and navigate to the repo folder.
2.  Run `npm install`
3.  Run `node src/index.js`
4.  Enjoy a menu!

## The script.json file and /script folder

If you run `node NOOBTERM_FOLDER/src/index.js` from a directory that has a `/script` folder noobterm will check if there is a `script.json` file there to display menu items from (there is an example script.json file in the repo). If there are other files in the `/script` folder noobterm will treat them as scripts (!!) and add them to the `/script` menu item, and when a script is selected from the menu noobterm will execute the script.

## noobterm from anywhere

If you want to type `noobterm` in any folder (and who wouldnt?!) you can add the following code to `~/.bash_profile` where `NOOBTERM_FOLDER` should be replaced with the path to where you pulled down this repo.

```
function noobterm {
  node NOOBTERM_FOLDER/src/index.js
}
```

## my own commands

If you set an enviroment variable called `NOOBTERM_SCRIPT_FILE` to a path of a `.json` file then those commands will always be displayed when running noobterm. This way you can store your general commands in the `.json` file and always have access to them.
