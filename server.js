let express = require('express'),
    request = require('request'),
    app = express(),
    port = process.env.PORT || 3000,
    currentMenu = {
        "uid": "1",
        "updateDate": "2016-05-23T00:00:00.0Z",
        "titleText": "Heutiger Speiseplan für die Mensa Griebnitzsee",
        "mainText": "Wir haben leider noch nicht nachgeguckt. Sorry.",
    };


app.listen(port, function(){
  // console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  updateMenu();
});

let intervalID = setInterval(updateMenu, 1000*60*60); // updates the menu once an hour

app.route('/getMenu')
    .get(getMenu);

app.route('/updateMenu')
    .get(updateMenu); // can be called to manually update the menu

function getMenu(req, res) {
    try {
        console.log("Trying to send menu: ", currentMenu);
        res.json(currentMenu);
    } catch (e) {
        console.log("Error at sending menu");
    } finally {

    }
}

function updateMenu(req, res) {
    try {
        console.log("Trying to update menu");
        let date = new Date;
        let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let apiDate = date.getFullYear() + '-' + month + '-' + day;
        let endpoint = 'http://openmensa.org/api/v2/canteens/62/days/' + apiDate + '/meals';
        let mealsResult = 'Heute gibt es: ';
        console.log("about to send request to menu api");
        request(endpoint, function(error, response, body){
            console.log("Request to update menu successful.");
            if(!body) {
                currentMenu.mainText = "Heute hat die Mensa leider geschlossen";
            }
            let meals = JSON.parse(body)
            for (const meal of meals) {
                mealsResult += meal.category + ': ' + meal.name + ', ';
            }
            currentMenu.mainText = mealsResult;
        });

        currentMenu.updateDate = apiDate + "T00:00:00.0Z";
        if (res) {
            console.log("About to send that logging was successfully initiated.");
            res.json({
                "uid": "1",
                "updateDate": "2016-05-23T00:00:00.0Z",
                "titleText": "Updating Menu",
                "mainText": "Currently updating menu. Should be available every second.",
            })
        }
    } catch (e) {
        console.log("Error while updating menu.");
        res.json({
            "uid": "1",
            "updateDate": "2016-05-23T00:00:00.0Z",
            "titleText": "Error Updating Menu",
            "mainText": "There was an error updating the menu. Please try again later.",
        })
    } finally {

    }
}
