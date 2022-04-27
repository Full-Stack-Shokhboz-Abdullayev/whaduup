# `whaduup` (whatsapp clone) - WebSocket based chat-application.

## Using remotely.
Just head over to https://whaduup-client.vercel.app/ - it's great demo to take a look with no headache.

## Running locally.
If you keen to run locally then follow the steps below.

### 1 - Running Server 
First of all set up .env variables as stated in the example file `/server/.env`;

Then run command:
```
cd server && npm run build && npm start
```

### 2 - Running Client
Create a file called `.env` or `.env.local` inside `/client` directory and then paste these environment variables (you must set the server port after localhost):
```
VUE_APP_API_BASE_URL=http://localhost:${PORT_THAT_YOU_SET_EARLIER_IN_THE_SERVER}
VUE_APP_SOCKET_URL=http://localhost:${PORT_THAT_YOU_SET_EARLIER_IN_THE_SERVER}
```

and just run:
```
cd client && npm run serve
```

So that's it, nice and neat.
