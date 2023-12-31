## Symphona
![Free_Sample_By_Wix-removebg-preview](https://github.com/diegorramos84/room-music/assets/17050237/6d0710b1-43e7-479a-92c8-4a1bcba1f93b)

## Overview



https://github.com/diegorramos84/room-music/assets/17050237/831d08c2-a76b-450e-8f7d-69ba74f7e4bb





The App aims to give your guests control over the party's music playlist, and even the power to vote on skipping tracks they're not vibing with.

## Features

 - Spotify API Auth
 - Room creations to share the control of the Host Spotify player
 - Possible to change room settings on the fly

## Technologies Used

- Django
- Django REST framework
- React.js - Vite
- Material UI
- ElephantSQL

## Getting Started

### Prerequisites
 - Python
 - Django
 - ElephantSQL account (https://dev.to/diegorramos84/connect-django-to-elephantsql-10g0)
 - Spotify premium (Host)

.env file (/path/to/room-music/music_controller/music_controller/.env)
```bash
# ElephantSQL data
DATABASE_NAME=$$$$$
DATABASE_USER=$$$$$
DATABASE_PASS=$$$
DATABASE_HOST=$$$$
DATABASE_PORT=$$$$

# Spotify data
CLIENT_ID=$$$$$
CLIENT_SECRET=$$$$$
REDIRECT_URI=$$$$
```

### Installation

## Clone the repo
``` bash 
git clone git@github.com:diegorramos84/room-music.git
```

## Frontend
### Go to the the frontend folder
``` bash 
cd room-music/frontend
```

## Install packages 
``` bash 
npm install
```
## Run the dev server 
``` bash 
npm run dev
```

## backend
### inside the root folder
``` bash 
#start pipenv
pipenv shell
```

## Install packages 
``` bash 
pipenv install
```

## cd to music_controller
``` bash 
cd music_controller
```
## Run the dev server 
``` bash 
python3 manage.py runserver
```


