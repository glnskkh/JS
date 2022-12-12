echo -n $1 > key.txt

node vigenere.js en rus.txt key.txt ru.json t.txt
node vigenere.js de t.txt ru.json o.txt text.txt russian.txt

tail -5 o.txt