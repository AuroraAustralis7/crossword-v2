READ ME:

v2.0 is an old implementation when I was trying to make a crossword without knowing how crosswords worked (oops).
v3.0 is the acctual working implementation. It takes any .puz file, breaks it down, and then displays it as a playable crossword puzzle.

Everything is rough and unpolished right now.

To set up, make sure you have node (installable at: https://nodejs.org) setup.

Run the following command to clone the repository to your own desktop 

```bash
git clone https://github.com/AuroraAustralis7/crossword-v2.git
```

Then run the following to set up dependencies:

```bash
cd C:\path\to\dir\crossword-v2\
cd .\v3.0\
npm install
```

Finally, run:

```bash
npm run dev
```

The crossword should then be live at port 5173, the default for vite.