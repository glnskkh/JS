FROM node

RUN ls

COPY . /app

RUN cd app

RUN useradd appuser && chown -R appuser /app
USER appuser

RUN cd /app/notation; node convert.js q.txt
