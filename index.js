const clientId = "3K0UNTQC1XJXH3IY55LUZ34RNEAG5X4HLMXJMEX5CI13H10N"
const clientSecret = "OLIUSNXXSDOXGWYMPXJOUI2Z40MCQXTC1Y44Z2GABROXEOGB" 
const searchUrl = "https://api.foursquare.com/v2/venues/explore"

function formatQueryParameters(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&')
}

function formatVenueAddress(responseJson){
    const venueAddress = responseJson.response.groups[0].items.map(function(key){ return key.venue.location.formattedAddress});
    return venueAddress.join('||');
}


function getVenueInfo(startingPoint, radiusValue, maxResults, timeOfDay, typeOfVenue, sortValue){
    params = {
        client_id: clientId,
        client_secret: clientSecret,
        v: 20190501,
        near: startingPoint,
        radius: radiusValue,
        limit: maxResults,
        time: timeOfDay,
        section: typeOfVenue,
        SortByDistance: sortValue
    }

    const queryStrings = formatQueryParameters(params);

    const url = searchUrl + '?' + queryStrings 
    
    
    fetch(url) 
        .then(response => {
            if (response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            const lat = responseJson.response.geocode.center.lat;
            const lng = responseJson.response.geocode.center.lng;
            const mapStartPoint = responseJson.response.geocode.where;
            const venueAddressString = formatVenueAddress(responseJson);
            getMapInfo(lat, lng, mapStartPoint, venueAddressString);
        })
        .catch(err=>{
            $('#js-error-message').text(`something went wrong${err.message}`)
        })
}





function mileToMeter(a, b) { 
    return $("#js-radius").val() * 1609.344
}

function getTypeOfVenueValue(){
    const radios = document.getElementsByName ("type")
    for (let i=0; i<radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function getSortValue(){
    const radios2 = document.getElementsByName("sort")
    for (let i=0; i<radios2.length; i++) {
        if (radios2[i].checked) {
            return radios2[i].value;
        }
    }
}

function watchForm() {
    $("form").submit(function(event){
        event.preventDefault();
        const startingPoint = $("#js-starting-point").val();
        const radiusValue = mileToMeter()
        const maxResults = $("#js-max-results").val();
        const timeOfDay = $("#js-time-of-day").val();
        const typeOfVenue = getTypeOfVenueValue();
        const sortValue = getSortValue();
        getVenueInfo(startingPoint, radiusValue, maxResults, timeOfDay, typeOfVenue, sortValue)
        getMapInfo()
        }) 
    }

    const mapKey = "9hamH9Q5QnLLJnGd3D0nTCDbbmARCP4e"
    const mapSearchUrl = "https://www.mapquestapi.com/staticmap/v5/map"
    
    function formatMapQueryParameters(mapParams){
        console.log(mapParams)
        const mapQueryItems = Object.keys(mapParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(mapParams[key])}`)
        return mapQueryItems.join('&')
    }

     function getMapInfo(lat, lng, mapStartPoint, venueAddressString){
         
         mapParams = {
             key: mapKey,
             size: 600+","+400,
             declutter: "true",
             locations: lat+","+lng+`|flag-sm-green-${mapStartPoint}||${venueAddressString}`
         }

        const mapQueryString = formatMapQueryParameters(mapParams);
        console.log(mapQueryString)
        const mapUrl = mapSearchUrl + "?" + mapQueryString;
        displayResults(mapUrl)
     }
     
  
     function displayResults(mapUrl){
         console.log(mapUrl)
        $('main').empty(); 
        $("main").html(`<div class = imageContainer><img src = "${mapUrl}"></div>`)
     }


    



$(watchForm())