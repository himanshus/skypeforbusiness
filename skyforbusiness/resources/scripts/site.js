﻿$(function () {
	'use strict';  
	

    $(".menu li a").click(function(){
        var module = this.id;
        if (module == 'anonymous-sign-in' || module == 'sign-in' || window.skypeWebApp && window.skypeWebApp.signInManager.state() == "SignedIn" || module == 'anonymous-conference-join'
            || module == 'provider' || module == 'patient-anonymous-join' || module == 'provider-conference-join' || module == 'schedule-meeting') {
            if($(this).hasClass("disable")){
                return;
            }

            loadPage(module);
            $(".menu a").removeClass("selectedNav");
            $(this).addClass("selectedNav");

           
        }
    });


    function loadPage(module){
        var url = "/S4B/skypeactivity/" + module + ".html";
        $.get(url, function(html){
            $(".content").html(html);
            $(".sign-in").show();
        });
    }

   

});
