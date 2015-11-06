
/**
 * This script demonstrates how to Sign in the anonymous user using the meeting URI
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;


    // when the user clicks on the "Start Conference" button
    $('#btn-sign-in').click(function () {

        var userName, meetingUri, JoinUrl;
       // $(".modal").show();

        userName = "Anonymous Patient";
        //Meeting Uri
        meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:YOEPQ9NB";

        JoinUrl = "https://meet.metio.ms/samb078/YOEPQ9NB";

        JoinConferenceAnonymously(userName, meetingUri, JoinUrl);
        
    });

   //To join conference/meeting Anonymously
    function JoinConferenceAnonymously(userName, meetingUri, joinUrl)
    {
        JoinExistingConference(meetingUri, joinUrl);
        //// SignIn as anonymous user using conference URI
        //client.signInManager.signIn({

        //    name: userName,
        //    meeting: meetingUri

        //}).then(function () {

        //    $(".modal").hide();
        //    alert('Signed in as: ' + client.personsAndGroupsManager.mePerson.displayName());
        //    alert("Start Video Meeting....")
            
        //    JoinExistingConference(meetingUri, joinUrl);
           

        //}, function (error) {

        //    // if something goes wrong in either of the steps above,
        //    // display the error message
        //    $(".modal").hide();
        //    alert("Can't sign in, please check the meeting URI ");
        //    window.location.reload();
        //    console.log(error || 'Cannot sign in');
        //});
    }

    function JoinExistingConference(meetingUri, joinUrl) {

       // var conference, videomeeting;

       // //Get an instance of Conversation
       // conference = client.conversationsManager.getConversationByUri(meetingUri);

       // //Add Participant
       // var participant = conference.createParticipant(client.personsAndGroupsManager.mePerson);
       //// participant.isAnonymous = true;

       // conference.participants.add(participant);
       //// alert(conference.onlineMeeting.joinUrl());

        //This is for opening conference window directly using conference URL
        window.open(joinUrl);



        ////Start Video Service
        //videomeeting = conference.videoService.start().then(function () {

        //    alert("Video meeting started....");


        //});

    }


});
