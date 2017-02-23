function login(e){
  let user = $('.user').val();
  let pass = $('.pass').val();
  alert('typ');
  let ws = new WebSocket("ws://172.20.10.11:3000/ws");
  ws.onopen = () => {
    NetworkService.Requests.Login({
      email: user,
      password: pass
    }, function(response){
      alert(response);
      onLoginResponse(response);      
    });
  }
  return false;
}


$(document).ready(function(){

        if ($(window).width() < 514) {
                $(".navbar-default").removeClass("navbar-fixed-top").addClass("gallery-mobile");
        }    


$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$("form").on("submit", login);

})