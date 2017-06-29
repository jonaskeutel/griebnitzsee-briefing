let express = require('express'),
    request = require('request'),
    app = express(),
    port = process.env.PORT || 3000,
    currentMenu = {
        "uid": "urn:uuid:1335c695-cfb8-4ebb-abbd-80da344efa6b",
        "updateDate": "2016-05-23T00:00:00.0Z",
        "titleText": "Heutiger Speiseplan für die Mensa Griebnitzsee",
        "mainText": "Wir haben leider noch nicht nachgeguckt. Sorry.",
}

JSON text multi-item example
        "uid": "1",
        "updateDate": (new Date).toString(),
        "titleText": "Heutiger Speiseplan für die Mensa Griebnitzsee",
        "mainText": 'Wir haben leider noch nicht nachgeguckt. Sorry.'
    };

app.listen(port);

let intervalID = setInterval(updateMenu, 86400000); // updates the menu once a day

app.route('/getMenu')
    .get(getMenu);

app.route('/updateMenu')
    .get(updateMenu); // can be called to manually update the menu

function getMenu(req, res) {
    res.json(currentMenu);
}

function updateMenu(req, res) {
    let date = new Date;
    let apiDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    let endpoint = 'http://openmensa.org/api/v2/canteens/62/days/' + apiDate + '/meals';
    let mealsResult = 'Heute gibt es: ';
    request(endpoint, function(error, response, body){
        if(!body) {
          currentMenu.mainText = "Heute hat die Mensa leider geschlossen";
        }
        let meals = JSON.parse(body)
        for (const meal of meals) {
          mealsResult += meal.category + ': ' + meal.name + ', ';
        }
        currentMenu.mainText = mealsResult;
    });
    currentMenu.updateDate = date.toString();
    res.send("Currently updating menu. Should be available every second.")
}
