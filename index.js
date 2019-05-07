const clientId = "3K0UNTQC1XJXH3IY55LUZ34RNEAG5X4HLMXJMEX5CI13H10N"
const clientSecret = "OLIUSNXXSDOXGWYMPXJOUI2Z40MCQXTC1Y44Z2GABROXEOGB" 
const searchUrl = "https://api.foursquare.com/v2/venues/explore"

function formatQueryParameters(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&')
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
        .then(responseJson => console.log(responseJson))
        .catch(err=>{
            $('#js-error-message').text(`something went wrong${err.message}`)
        })
}

function mileToMeter(a, b) { return $("#js-radius").val() * 1609.344
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
        
        }) 
    }

    




$(watchForm)