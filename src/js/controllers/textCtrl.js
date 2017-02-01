app.controller('textCtrl', function($http) {
  var that = this;
  this.textData = {};
  var language = navigator.language;
  var norsk = language.indexOf('nb')>-1;
  var nynorsk = language.indexOf('nn')>-1
  var english = language.indexOf('en')>-1;
  var requests = 0;
  if(requests<2){
    if(norsk){
      $http.get('//static.thorin-games.tk/js/objects/no-text.json').success(function(data) {
        this.textData = data;
        console.log(that.textData);
        requests = requests + 1;
      }.bind(this)).error(function(data, status) {
        this.textData = data;
        alert('Det oppsto et problem med innlastingen av tekst-dataen. Beklager dette. Status: ' + status);
      });
    } else if (nynorsk) {
      $http.get('//static.thorin-games.tk/js/objects/nn-text.json').success(function(data) {
        this.textData = data;
        console.log(that.textData);
        requests = requests + 1;
      }.bind(this)).error(function(data, status) {
        this.textData = data;
        alert('Det oppsto eit problem med innlastinga av tekst-dataen. Beklagar dette. Status: ' + status);
      });
    } else {
      $http.get('//static.thorin-games.tk/js/objects/en-text.json').success(function(data) {
        this.textData = data;
        console.log(that.textData);
        requests = requests + 1;
      }.bind(this)).error(function(data, status) {
        that.textData = data;
        alert('An error occured while fetching data from the server. Status: ' + status);
      });
    }
  }
});
