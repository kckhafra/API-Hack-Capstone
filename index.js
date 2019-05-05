const apiKey = "prtl6749387986743898559646983194"




function getFlightInfo(countryValue, currencyValue, localeValue, originPlaceValue, destinationValue, leavingDateValue, returnDateValue){
    

    const url = `http://partners.api.skyscanner.net/apiservices/browseroutes/v1.0/${countryValue}/${currencyValue}/${localeValue}/${originPlaceValue}/${destinationValue}/${leavingDateValue}/${returnDateValue}?apiKey=${apiKey}`
    
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

function watchForm() {
    $("form").submit(function(event){
        event.preventDefault();
        const countryValue = $("#js-country").val();
        const currencyValue = $("#js-currency").val();
        const localeValue = $("#js-locale").val();
        const originPlaceValue = $("#js-leaving-from").val();
        const destinationValue = $("#js-destination").val();
        const leavingDateValue = $("#js-leaving-date").val();
        const returnDateValue = $("#js-return-date").val();
        getFlightInfo(countryValue, currencyValue, localeValue, originPlaceValue, destinationValue, leavingDateValue, returnDateValue)
    })
}

$(watchForm)