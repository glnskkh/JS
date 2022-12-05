FROM node

COPY . /app

RUN cd app

RUN useradd -d /home/appuser appuser && chown -R appuser /app /home/
USER appuser

RUN cd app/; node main.js -a mur -b main.js -q q.txt
