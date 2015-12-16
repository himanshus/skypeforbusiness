
/**
 * This script demonstrates how to Sign in the anonymous user using the joinUrl
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;


    // when the user clicks on the "Start Conference" button
    $('#joinConference').click(function () {

        var joinUrl;
        $(".modal").show();
     
        /*Get the joinUrl after scheduling the meeting. In real implementation,
          we need to get this value from DB or any other storage based on
          storing the joinUrl after scheduleMeeting implementation.
        */

        joinUrl = "https://meet.metio.ms/samb078/CEVYS728";
        
        //joinUrl = localStorage.getItem("joinUrl"); //Get the value from localStorage

        //Join the conference using joinUrl
        JoinConferenceAnonymously(joinUrl);
        
    });

    /*To join existing conference/meeting Anonymously
      @param { String} joinUrl - Existing joinUrl got from scheduleMeeting
    */
    function JoinConferenceAnonymously(joinUrl)
    {
        //Open the Conversation window using joinUrl
        window.open(joinUrl);
       
    }

});
