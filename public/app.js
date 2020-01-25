$.getJSON("/all", function(data){
    console.log(data);
    for (var i = 0; i < data.length; i++){
      $("#results").append( "<tr><td>" + data[i].title + "</td>" +
                              "<td><a href='" + data[i].link + "'>" + data[i].link + "</a></td>" +
                              "<td><img src='" + data[i].image +  " '/></td>" + 
                              "<td>" + data[i].summary + "</td></tr>");
    }
});
  
  function setActive(selector) {
    $("th").removeClass("active");
    $(selector).addClass("active");
  }
  
  $("#headline-sort").on("click", function(){
    $("#tbody").empty();
    setActive("#title");
  
    $.getJSON("/title", function(data){
      console.log(data);
      for (var i = 0; i < data.length; i ++) {
        $("#tbody").append("<tr><td>" + data[i].title + "</td>" +
        "<td><a href='" + data[i].link + "'>" + data[i].link + "</a></td>" +
        "<td><img src='" + data[i].image +  " '/></td>" +
        "<td>" + data[i].summary + "</td></tr>");
      }
    }) 
  });
