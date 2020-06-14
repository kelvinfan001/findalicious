<h1 align="center"> <a href="https://findalicious.herokuapp.com"> <img src="./readme_assets/findalicious_brushstroke.png" width="70%"></a> </h1>
<p align="center">
<img alt="Open Source" src="https://img.shields.io/badge/open%20source-❤-brightgreeen">
<img alt="License" src="https://img.shields.io/github/license/kelvinfan001/findalicious">
<img alt="Issues" src="https://img.shields.io/github/issues/kelvinfan001/findalicious">
<a href="https://www.codacy.com/manual/kelvinfan001/findalicious?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=kelvinfan001/findalicious&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/96e76632d098445381cc988e49281de5"/></a>
<img alt="Top Language" src="https://img.shields.io/github/languages/top/kelvinfan001/findalicious">
<img alt="Author Badge" src="https://img.shields.io/badge/made%20by-Kelvin%20Fan-blue">
<img alt="Github Follows" src="https://img.shields.io/github/followers/kelvinfan001?label=Follow&style=social">
</p>

## Description
A Tinder-style app for deciding where to eat with your friends. Quickly create a room with your friends and swipe through restaurants in your local area.

## Instructions

### Creating a Room
1. Select `CREATE ROOM`.
2. Allow browser to provide your location to Findalicious. Your location should be displayed if location was found successfully.
3. Select a radius (`1KM`, `2KM`, `5KM`) to search for restaurants.
4. Tap on `CREATE` to create room. 
5. Your room number should be displayed at the top.
<p> <img src="./readme_assets/create_room_demo.gif" width="25%"></a> </p>

### Joining a Room
1. Tap on `JOIN ROOM` and enter room number OR
2. Enter a URL in your browser `https://findalicious.herokuapp.com/rooms/<ROOM NUMBER>`.
<p> <img src="./readme_assets/join_room_demo.gif" width="25%"></a> </p>

### Swiping
1. When all your friends are in the room and ready, tap `EVERYONE IS IN`.
2. Double tap on a restaurant to scroll through photos.
3. Swipe *right* to "LIKE" a restaurant or swipe *left* to dismiss a restaurant.
4. If everyone in the room swiped *right* on ("LIKED") a restaurant, it will show up as a match!
<p> <img src="./readme_assets/swiping_demo.gif" width="25%"></a> </p>

### After Finding a Match
Congrats! You've found a restaurant that everyone likes.

You can tap on the restaurant photo to open it's Yelp page, or tap on the *directions icon* to open Google Maps and find directions.

If you'd like to continue swiping, tap anywhere in the background to dismiss the pop up if you are not satisfied with the match.


## License
Copyright © 2020 [Kelvin Fan](https://github.com/kelvinfan001).<br>
This project is [GPL-3.0](https://github.com/kelvinfan001/findalicious/blob/master/LICENSE) licensed.