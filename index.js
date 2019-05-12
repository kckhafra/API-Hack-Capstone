const clientId = "3K0UNTQC1XJXH3IY55LUZ34RNEAG5X4HLMXJMEX5CI13H10N"
const clientSecret = "OLIUSNXXSDOXGWYMPXJOUI2Z40MCQXTC1Y44Z2GABROXEOGB" 
const searchUrl = "https://api.foursquare.com/v2/venues/explore"

function formatQueryParameters(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&')
}

function formatVenueAddress(responseJson){
    const venueAddress = responseJson.response.groups[0].items.map(function(key){ return key.venue.location.formattedAddress + `|flag-red-sm-${key.venue.name}||`});
   
   console.log(venueAddress)
    return venueAddress.join();
    
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
            getMapInfo(lat, lng, mapStartPoint, venueAddressString, responseJson);
            
            
            
        })
        .catch(err=>{
            $('#js-error-message').text(`something went wrong${err.message}`)
        })
}





function mileToMeter(a, b) { 
    return $("#js-radius").val() * 1609.344
}

function getTypeOfVenueValue(){
    return $("#venueCategories").val()
}

function getSortValue(){
    return $("sort").val()
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
        handleReturn()
    }

    const mapKey = "9hamH9Q5QnLLJnGd3D0nTCDbbmARCP4e"
    const mapSearchUrl = "https://www.mapquestapi.com/staticmap/v5/map"
    
    function formatMapQueryParameters(mapParams){
        console.log(mapParams)
        const mapQueryItems = Object.keys(mapParams).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(mapParams[key])}`)
        return mapQueryItems.join('&')
    }

     function getMapInfo(lat, lng, mapStartPoint, venueAddressString, responseJson){
         
         mapParams = {
             key: mapKey,
             size: 600+","+400,
             declutter: "true",
             locations: lat+","+lng+`|flag-sm-green-${mapStartPoint}||${venueAddressString}`
         }

        const mapQueryString = formatMapQueryParameters(mapParams);
        console.log(mapQueryString)
        const mapUrl = mapSearchUrl + "?" + mapQueryString;
        displayResults(mapUrl, responseJson)
     }
     
    
    
     function displayResults(mapUrl, responseJson){
        console.log(responseJson)
        
        $('main').empty(); 
        if (responseJson.response.totalResults === 0) {
            $("main").html(`<section class="error-container"><p class = "error-message"> We have no venue reccomendations for this location at this time.</p>
            <button class="return" id="return" type="button">Return</button></section>` )
        }
        else {
        $("main").html(`
        <section class = "venuemap-container">
            <ul class="venue-list">
            ${responseJson.response.groups[0].items.map(function(key){ 
                const venueName = key.venue.name
                const venueAddress = key.venue.location.address + "<br>" + key.venue.location.city + " " + key.venue.location.state + "<br>" + key.venue.location.country + " " + key.venue.location.postalCode
                return `
            <li>${venueName}<br>${venueAddress}</li> `}).join('')
            }
            </ul>
            
            <button class="return" id="return" type="button">Return</button>
        

            <br>
            
            <div class = map-container>
                <img src = "${mapUrl}">
            </section>
        </div>
            `)
     }
    }

     function handleReturn(){
        $('main').on("click", ".return",
        function(event) {
          event.preventDefault();
          location.reload()
        })
    }   

    



$(watchForm())