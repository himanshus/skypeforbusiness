
/**
 * This script demonstrates how to join a conference
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;


    // start an online meeting and start video
    $('#joinConference').click(function () {

        var userName, password, meetingUri;

        //Provider UserName
        userName = "kima078@metio.ms";
        //Provider Passwork
        password = "UCW4*fun!";
        
        /*Get the meetingUri after scheduling the meeting. In real implementation,
         we need to get this value from DB or any other storage based on
         storing the meetingUri after scheduleMeeting implementation.
       */

        meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:5LOPYAFC";
       // meetingUri = localStorage.getItem("meetingUri"); //Get the value from localStorage

        //Join the conference using Provide credentials and meetingUri
        JoinConference(userName, password, meetingUri);

       
    });


    /* Join conference by Provider
      @param {String} userName - Provider User Name
      @param {String} password - Provider password
      @param {String} meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
      
     */
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

            //Join existing meeting 
            JoinExistingConference(meetingUri);

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();
            alert("Sorry!! Please try again");
           
        });

    }

    /* Join existing meeting/conference using meetingUri got from scheduledMeeting
     @param {String} meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
      we need to get this value from DB or any other storage based on
      storing the meetingUri after scheduleMeeting implementation.
     
    */
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

});
