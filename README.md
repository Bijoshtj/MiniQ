# MiniQ
Setup:

1. Clone repo to a directory and do npm install (required nodejs installed in running system).
2. Create mysql database and and add database details to resources/database.json
3. Run migrations:
   db-migrate --config resources/database.json -m resources/migrations up
4. start server:
   node server.js

Now Application will be running on default port 3000.

Api's end points:

All api are of type post

1. http://localhost:3000/enqueue:
   To enqueue message to queue
   params: {queue_id: 'q_name', data: ''}

2. http://localhost:3000/dequeue: 
   To dequeue message for a particular queue in fifo
   params: {queue_id: 'q_id'}

3. http://localhost:3000/ack:
   To acknowledge consumed queue data.
   params: {id: 'data_id', ack: 'ACK'}
   ack value can be ACK/NACK


Dequeue non-acknowledged consumed message by setting up cronjob to run every 1 minute:

cd /path/MiniQ && node tools/reque_nonack.js
