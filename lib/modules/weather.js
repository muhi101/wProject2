/*
Author: M Jakda
Date: 11/03/2014
Description: Main and only module that contains the functionality that drives the Weather app
*/
define(['underscore', 'jquery', 'async!http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false'], function(underscore,jquery,placemaker) {
	var startUrl = "http://api.openweathermap.org/data/2.5/weather?q=" ;  // The base URI to access the Openweather API
 	var fullUrl; // stores the complete URI to request the openweather API data with the city required included
 	var baseIconUrl =  "http://openweathermap.org/img/w/" // base URL for the graphic icon for weather condition
 	var iconName;
 
 	var city; // to store the dynamic city value inputed by user
 	var $location_input = $("#searchTextField"); // point to the input form field
 
 	var weatherTemplate = _.template($("#weather-tpl").text()); // sets up template to display weather to use
 	var errorTemplate = _.template($("#error-tpl").text()); // sets up template to display error panel
 	
 	_.templateSettings.variable = "cityCollection"; // Grab the HTML out of our template tag and pre-compile it.
	var cityTemplate = _.template($( "#cities-nav-bar-tpl" ).html()); // sets up template to display cities navigation panel
 
	// config settings for Google places API for auto suggestion for UK cities only
	var options = {
    	types: ['geocode'], 
    	componentRestrictions: {country: "uk"}
 	}; 
	// instantiate object to be able to use Google Place Autocomplete feature
	var autocomplete = new google.maps.places.Autocomplete($location_input.get(0), options); 
 
	
	/*** function to set city location ***/
	var setLocation = function(){
		try{
			// Add event listener with callback when new new chosen
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				city = $location_input.val();
				fullUrl = startUrl + encodeURIComponent(city) ;
				getWeather(fullUrl); // call function to retreive weather details passing fullurl address
				return false;
			});
		}
		catch(err) {
			var errorMsg = 'City input autocomplete suggestion not working';
			renderErrorMsg(errorMsg);
		}
	};
  
  	/*** function to retreive weather data ***/
  	var getWeather = function(fullUrl){
	  	var weatherAPI = fullUrl;
	  	hideErrorPanel();
	  
		$.ajax({url:weatherAPI,dataType:"jsonp"})
		.done(function(object){
			//console.log(JSON.stringify(object));
			// no weather found for location
			if(object.message === "Error: Not found city"){
				var errorMsg = 'City not found';
				renderErrorMsg(errorMsg);
			}
			else{
				///call function to display weather data received 
				renderWeather(object);
			}
		})
	   .fail(function(){
			var errorMsg = 'Error retrieving City weather';
			renderErrorMsg(errorMsg);
	   });
	};
  
  	/*** function to display updated weather data ***/
  	var renderWeather = function(object){
		iconUrl = object.weather[0].icon;
		iconName = baseIconUrl + iconUrl; // url for weather condition icon
		//setup variable to store template values
		var wObj = 	{'cityName': object.name, 'cityLat': object.coord.lat, 'cityLon': object.coord.lon, 
					'cityDescription': object.weather[0].description, 'cityIcon': iconName, 'cityHumidity': object.main.humidity, 'cityTemparate': object.main.temp,
					'cityTemp_min':object.main.temp_min, 'cityTemp_max':object.main.temp_max, 'cityPressure': object.main.pressure
					}
		
		var htmlContents = weatherTemplate(wObj);
    	$("#weatherBox").html(htmlContents); // update weather data container div with template contents
  	};
  
	/*** function to display default cities ***/
  	var renderDefaultCities = function(object){
		var cities = object;
		// Define our render data (to be put into the "cityCollection" variable).
    	var templateData = cities;
		// Inject cities template into DOM.
    	$("#citiesBox").html(cityTemplate(templateData));
  	};
	
	/*** function to bind events for city links***/
  	var bindCities = function(){
		$('#citiesBox ul').on('click','a', function(e){
			e.preventDefault();
			city = $(this).attr('id');
			console.log(city);
			fullUrl = startUrl + encodeURIComponent(city) ;
			getWeather(fullUrl); // call function to retreive weather details passing fullurl address
		});
  	};
  
	/*** function to handle error messages ***/
	var renderErrorMsg = function(errorMsg){
		var errorMsg = {'errorMsg': errorMsg};
		var htmlContents = errorTemplate(errorMsg);
    	$("#errorBox").html(htmlContents); // update error panel container div with template contents
  	};
  
	/*** function to remove error panel ***/
	var hideErrorPanel = function(){
    	$("#errorBox").html(''); // hide / clear error panel container div 
	};
  

return {
	setLocation:setLocation,
	renderDefaultCities:renderDefaultCities,
	bindCities:bindCities
  };
});