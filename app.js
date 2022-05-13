

// let lat;
// let long;

// const getLocation = () => {
// return(navigator.geolocation.getCurrentPosition(showPosition));

// } 

var UserCoords = { lat: '', long: '' };
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function processInfo(data1,latLong){

    //inital processing of data, resetting current list to empty
    console.log(data1);
    document.getElementById("content-main").innerHTML = "";
    //var to store temp data of destination for each iteration over each location
    let destinationInfo;
    let retString;

    //parent ul
    let list = document.getElementById("content-main");
    //initializing a sub ul for each item in the list of movies
    let i = 0;
    let data2;
    data1.forEach((item) => {
        let name = data1[i].name;
        let li = document.createElement("div");
        try {
        let headers = new Headers();
        headers.append("origin", null);
        data2 = data1[i];
        // console.log(data1[i].geometry.location.lat);
        // console.log(data1[i].geometry.location.lng);
        fetch(`https://stormy-earth-41391.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${data1[i].geometry.location.lat}, ${data1[i].geometry.location.lng}&origins=${latLong.lat},${latLong.long}&units=imperial&key=AIzaSyCDrxi1blX3JmChSsup4Z8bSd62On_FcFE`,{
            method: 'GET',
            headers: headers
        })
    .then(response => response.json())
    .then(data => {destinationInfo = data;
        // console.log(destinationInfo);
        // console.log(name);

        //PHOTO LINK  HERE: MAKE SURE THERE ARE NO WHITESPACES, YOU CAN CHANGE THE MAX WIDTH AND MAX HEIGHT
        //`https://maps.googleapis.com/maps/api/place/photo
        //?maxwidth=400
        //?maxheight=400
        // &photo_reference=${data2.photos[0].photo_reference}
        // &key=AIzaSyCDrxi1blX3JmChSsup4Z8bSd62On_FcFE`
        
        retString = 
        `<div class="location-result-${i}" style="text-align: center; font-size:1.25em; padding: 10px;">${name}</div>
        <div><ul>
        <li>Address: ${destinationInfo.destination_addresses[0]}</li>
        <li>Distance: ${destinationInfo.rows[0].elements[0].distance.text}</li>
        <li>Estimated Travel Time: ${destinationInfo.rows[0].elements[0].duration.text}</li>
        </ul></div>`

        //IMPORTANT: image for background: ${data1[i].photos[0].html_attributions[0]}
        
        /*name + '<ul>'
        + '<li>' + 'Address: ' + destinationInfo.destination_addresses[0] + "</li>"
        + '<li>' + 'Distance: ' + destinationInfo.rows[0].elements[0].distance.text+ "</li>"
        + '<li>' + 'Estimated Travel Time: ' + destinationInfo.rows[0].elements[0].duration.text + "</li>"

        + '</ul>'*/
        
        console.log(retString);
        
        
        li.innerHTML = retString;
        list.appendChild(li);       
        })
        } catch (e) {
        console.log(e);
        };  

        i++;
    }
    
    );

    //getting each sub ul
    // let listElements = Array.from(document.querySelectorAll('ul ul'));
    // for(let i = 0; i < listElements.length; i++){
        
    //   //fetching data, destination info is the response object


    // }        
}

function showPosition(position) {
    UserCoords.lat = position.coords.latitude;
    UserCoords.long = position.coords.longitude;
    console.log(UserCoords);//Works
}

function getUserCoords(radius) {
radius = radius * 1609
    var promise1 = new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(function(pos){
        lat = pos.coords.latitude
        long = pos.coords.longitude
        resolve({lat,long});
        }) 
    })

    promise1.then(function(value) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', "<Origin>");
    headers.append('mode', "no-cors");

    try {
        fetch(`https://stormy-earth-41391.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${value.lat},${value.long}&radius=${radius}&types=movie_theater&name=movie&key=AIzaSyCDrxi1blX3JmChSsup4Z8bSd62On_FcFE`,{
            method: 'GET',
            headers: headers
        })
    .then(response => response.json())
    .then(data => processInfo(data.results, {lat,long}))
        } catch (e) {
        console.log(e);
        };

    });
}