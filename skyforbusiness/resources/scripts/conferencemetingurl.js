

/**
 * This script demonstrates how to generate skype Video meeting url
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;

    // start an online meeting and start video
    $('#startNewVideoMeeting').click(function () {

        var conference, videomeeting, meetingUri;

        //Create a Conversation
        conference = client.conversationsManager.createConversation();
           
        $('#newMeetingUri').val("");

        //Start Video Service
        videomeeting = conference.videoService.start().then(function () {

           
            //Get Conference/Meeting URL
            meetingUri = conference.uri();
         

            //Save Conference Uri (For demo we are saving in a text file)
            //SaveConferenceUri(meetingUri);

            //Assign URL to text 
            $('#newMeetingUri').val(meetingUri);

            $(".c-add-p-container").removeClass('hide');
        });


    });
    

    
});

