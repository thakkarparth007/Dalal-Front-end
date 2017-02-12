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
    $('.btn-2').click(function(e){        
        $('.btn-1').removeClass('active-btn');
        $('.btn-1').addClass('passive-btn');
        $('.btn-2').removeClass('passive-btn');
        $('.btn-2').addClass('active-btn');
    });

    $('.btn-1').click(function(e){        
        $('.btn-2').removeClass('active-btn');
        $('.btn-2').addClass('passive-btn');
        $('.btn-1').removeClass('passive-btn');
        $('.btn-1').addClass('active-btn');
    });

    $('.buySection').click(function(e){        
        $('.sellSection').removeClass('activeSection');
        $('.sellSection').addClass('passiveSection');
        $('.buySection').removeClass('passiveSection');
        $('.buySection').addClass('activeSection');
    });

    $('.sellSection').click(function(e){        
        $('.buySection').removeClass('activeSection');
        $('.buySection').addClass('passiveSection');
        $('.sellSection').removeClass('passiveSection');
        $('.sellSection').addClass('activeSection');
    });



})(jQuery);

                     
     
  