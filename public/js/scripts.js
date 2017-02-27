(function() {
    "use strict";

    // custom scrollbar

    

    $("html").niceScroll({styler:"fb",cursorcolor:"#1ABC9C", cursorwidth: '6', cursorborderradius: '10px', background: '#424f63', spacebarenabled:false, cursorborder: '0',  zindex: '1000'});

    $(".scrollbar1").niceScroll({styler:"fb",cursorcolor:"rgba(97, 100, 193, 0.78)", cursorwidth: '6', cursorborderradius: '0',autohidemode: 'false', background: '#F1F1F1', spacebarenabled:false, cursorborder: '0'});

	
	
    $(".scrollbar1").getNiceScroll();
    if ($('body').hasClass('scrollbar1-collapsed')) {
        $(".scrollbar1").getNiceScroll().hide();
    }


    //mortgage transfer
    $(document).on("click", '.btn-2', function(e){        
        $('.btn-1').removeClass('active-btn');
        $('.btn-1').addClass('passive-btn');
        $('.btn-2').removeClass('passive-btn');
        $('.btn-2').addClass('active-btn');
    });

    $(document).on("click", '.btn-1', function(e){        
        $('.btn-2').removeClass('active-btn');
        $('.btn-2').addClass('passive-btn');
        $('.btn-1').removeClass('passive-btn');
        $('.btn-1').addClass('active-btn');
    });

    $(document).on("click", '.buySection', function(e){
        $('.sellSection').removeClass('activeSection');
        $('.sellSection').addClass('passiveSection');
        $('.buySection').removeClass('passiveSection');
        $('.buySection').addClass('activeSection');        
    });

    $(document).on("click", '.sellSection', function(e){
        $('.buySection').removeClass('activeSection');
        $('.buySection').addClass('passiveSection');
        $('.sellSection').removeClass('passiveSection');
        $('.sellSection').addClass('activeSection');        
    });

    $(document).on("click", '.bid-2', function(e){        
        $('.bid-1').removeClass('bidOrderActive');
        $('.bid-1').addClass('bidOrderPassive');
        $('.bid-2').removeClass('bidOrderPassive');
        $('.bid-2').addClass('bidOrderActive');
    });

    $(document).on("click", '.bid-1', function(e){        
        $('.bid-2').removeClass('bidOrderActive');
        $('.bid-2').addClass('bidOrderPassive');
        $('.bid-1').removeClass('bidOrderPassive');
        $('.bid-1').addClass('bidOrderActive');
    });

    $(document).on("click", '.ask-2', function(e){        
        $('.ask-1').removeClass('askOrderActive');
        $('.ask-1').addClass('askOrderPassive');
        $('.ask-2').removeClass('askOrderPassive');
        $('.ask-2').addClass('askOrderActive');
    });

    $(document).on("click", '.ask-1', function(e){        
        $('.ask-2').removeClass('askOrderActive');
        $('.ask-2').addClass('askOrderPassive');
        $('.ask-1').removeClass('askOrderPassive');
        $('.ask-1').addClass('askOrderActive');
    });



})(jQuery);

                     
     
  