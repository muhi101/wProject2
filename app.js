/*
Author: M Jakda
Date: 11/03/2014
Description: entry point into Weather app
*/

require.config({
  paths: {
    "jquery": "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
    "underscore": "lib/underscore",
    "async": "lib/async"
  }
});

require(['lib/modules/weather'], function(weather) {
  var defaultCities = {listItems: [{city: "London"},{city: "Luton"},{city: "Manchester, United Kingdom"},{city: "Birmingham"}]}; // object to store default cites for user to click on
  //call functions within the weather module
  weather.setLocation();
  weather.renderDefaultCities(defaultCities);
  weather.bindCities();
});