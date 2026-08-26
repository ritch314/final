# for you

A small interactive site, built for one person in particular.

## Running it locally

No build step, no install. Just open `index.html` in a browser —
double-click it, or drag it into a browser window.

If you want to be extra safe about relative-path/font loading, you
can also serve it locally instead of opening the file directly:

```bash
# from inside this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Personalizing it

Everything you're likely to want to change lives in **`js/config.js`**:

- `siteConfig` — her name, your name, both locations, your signature, whether to remember her answer locally, and an optional music file path.
- `traits` — the "things I've noticed about you" cards.
- `timeline` — the "little moments" timeline.
- `promises` — the "what I can promise" cards.
- `gallery` — captions for the memory gallery. Set an `img` path (e.g. `assets/images/1.jpg`) on any entry to use a real photo instead of the gradient placeholder.

You shouldn't need to touch `js/main.js` or `css/style.css` unless
you want to change how the site behaves or looks structurally.

## Folder structure

```
courting-site/
├── index.html          the page itself
├── css/
│   └── style.css        all styling
├── js/
│   ├── config.js         ← edit this to personalize
│   └── main.js           site logic (loader, animations, game, question flow)
├── assets/
│   ├── audio/            optional background music file goes here
│   └── images/           optional real photos for the gallery go here
└── README.md
```

## Adding music

Drop an mp3 into `assets/audio/`, then set:

```js
musicFile: "assets/audio/your-song.mp3"
```

in `js/config.js`. Music is off by default and never autoplays with
sound — she has to press the toggle herself.

## Adding real photos

Drop images into `assets/images/`, then point a gallery entry at them
in `js/config.js`:

```js
{ img: "assets/images/1.jpg", caption: "That one conversation that went on for hours" }
```

## Privacy

No analytics, no tracking, nothing sent to a server. If
`rememberAnswerLocally` is `true` in `config.js`, her YES / "let me
think" choice is saved only in her browser's `localStorage` on her
own device, so the site remembers her answer if she reopens it.
Set it to `false` to disable that entirely.
