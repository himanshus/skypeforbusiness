
/**
 * This script demonstrates how to join a conference
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;

    // start an online meeting and start video
    $('#joinConference').click(function () {

        alert("Join Conference...");

        var conference, videomeeting;
       
        //Get Conference URL
        var conferenceURI = $('#meetingUri').val();

        //Get an instance of Conversation
        conference = client.conversationsManager.getConversationByUri(conferenceURI);

        //Start Video Service
        videomeeting = conference.videoService.start();
        



          
    });


});
