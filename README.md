# Mouse saver

> Save your mouse - control your computer without touching it.

## Todo

Add calibration for scaling constants in `index.html`.

## Development

Clone the repo, install node modules:

```
$ git clone https://github.com/ajay-gandhi/mouse-saver.git
$ cd mouse-saver
$ npm install
```

Compile the mouse mover:

```
$ gcc -o mouse mouse.c -Wall -framework ApplicationServices
```

Run the application:

```
$ npm start
```
