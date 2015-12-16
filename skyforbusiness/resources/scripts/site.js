$(function () {
	'use strict';  
	

    $(".menu li a").click(function(){
        var module = this.id;
        if (module == 'anonymous-sign-in' || module == 'sign-in' || window.skypeWebApp && window.skypeWebApp.signInManager.state() == "SignedIn" || module == 'anonymous-conference-join'
            || module == 'provider' || module == 'patient-anonymous-join' || module == 'provider-conference-join' || module == 'schedule-meeting' || module == 'provider-conference-anonymous-join' || module == 'patient-anonymous-join-uri' || module == 'provider-conference-uri' ) {
            if($(this).hasClass("disable")){
                return;
            }

            loadPage(module);
            $(".menu a").removeClass("selectedNav");
            $(this).addClass("selectedNav");

           
        }
    });

    //Get Base Url
    function baseUrl() {
        var href = window.location.href.split('/');
        return href[0] + '//' + href[2] + '/' + href[3] + '/';
    }

    function loadPage(module) {

        var url = baseUrl() + "skypeactivity/" + module + ".html";
        $.get(url, function(html){
            $(".content").html(html);
            $(".sign-in").show();
        });
    }

   

});
