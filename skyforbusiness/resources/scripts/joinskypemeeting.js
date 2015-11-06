
/**
 * This script demonstrates how to join a conference
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;


    // start an online meeting and start video
    $('#joinConference').click(function () {

        var userName, password, meetingUri;

        userName = "kima078@metio.ms";
        password = "UCW4*fun!";

        meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:YOEPQ9NB";

        JoinConference(userName, password, meetingUri);

       
    });


    function JoinConference(userName, password, meetingUri) {


        $(".modal").show();

        // start signing in
        client.signInManager.signIn({
            username: userName,
            password: password
        }).then(function () {

            // when the sign in operation succeeds display the user name
            $(".modal").hide();

            console.log('Signed in as ' + client.personsAndGroupsManager.mePerson.displayName());

            alert("Join Conference...");

            JoinExistingConference(meetingUri);

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();
            alert("Sorry!! Please try again");
           
        });

    }

    function JoinExistingConference(meetingUri)
    {

        var conference, videomeeting, conv;

        //Get an instance of Conversation
        conference = client.conversationsManager.getConversationByUri(meetingUri);

        //Add Participant
        var participant = conference.createParticipant(client.personsAndGroupsManager.mePerson);
        conference.participants.add(participant);

        //Start Video Service
        videomeeting = conference.videoService.start().then(function () {

           
        });

    }

    function GetAvailablity(me)
    {
        me.displayName.get().then(function (value) {
            $('#providerName').text(value);
        });

        //Update Presence Status
        me.status.get().then(function (status) {
            $('#presenceStatus').text("Presence Status: " + status);
        });


        //Update Presence Status
        me.status.changed(function (status) {
            $('#presenceStatus').text("Presence Status: " + status);
        });

        //Update Presence Status
        me.note.changed(function (note) {
            $('#note').text("Note: " + note);
        });

        ////Update Presence Status
        //me.activity.changed(function (activity) {
        //    $('#activity').text("Activity: " + activity);
        //});

        //Update Presence Status
        me.location.changed(function (location) {
            $('#location').text("Location: " + location);
        });

        me.subscribe();

        

    }


});
