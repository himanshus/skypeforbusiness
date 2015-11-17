

/**
 * This script demonstrates how to schedule a metting, also get provider presence status, meeting status
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;

    //Provider SIP to be used to get Provider status
    var providerSIP = "kima078@metio.ms"; 

    /* meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
      
     */
    var meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:J2XIW9SA";

    // start an online meeting and start video
    $('#scheduleMeeting').click(function () {

        var userName, password, meetingUri;

        
        userName = "samb078@metio.ms";
        password = "UCW4*fun!";

        $(".modal").show();

        // start signing in
        client.signInManager.signIn({
            username: userName,
            password: password
        }).then(function () {

            // when the sign in operation succeeds display the user name
           

            console.log('Signed in as ' + client.personsAndGroupsManager.mePerson.displayName());
          

            alert("Scheduled A Meeting");

            var meetingDescription = "Schedule a Meeting";
            var meetingSubject = "Provider-Patient Conference";
            var expirationTime = new Date(+new Date + 24 * 60 * 60 * 1000);

            $('#joinUrl').val("");
            $('#meetingUri').val("");
            
            
            //Schedule a Meeting
            ScheduleMeeting(meetingSubject, meetingDescription, expirationTime);

            

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();

            alert("Sorry!! Please try again");
        });


    });

    $('#meetingDetails').click(function () {

        var userName, password;

        userName = "samb078@metio.ms";
        password = "UCW4*fun!";

        $(".modal").show();

        // start signing in
        client.signInManager.signIn({
            username: userName,
            password: password
        }).then(function () {

            $(".modal").hide();
            // when the sign in operation succeeds display the user name
            console.log('Signed in as ' + client.personsAndGroupsManager.mePerson.displayName());

           // alert(providerSIP);

            //Get Presence Status of Provider
            SubscribeToUser(providerSIP);

            //Get Meeting details
            GetMeetingDetails(meetingUri);
           

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();

            alert("Sorry!! Please try again");
        });


     });



    //#region Schedule a Meeting
    /**
     * @param {String} description - Purpose of the meeting
    
     * @param {Date} expirationTime - The UTC date and time after which the online meeting can be deleted.
     *
     *  The day and time must be between one year before, and ten years after,
     *  the current date and time on the server.
    
     * @param {String} subject - The subject of the online meeting.
     * @property {String} joinUrl - The URL that is used when the online meeting is joined from the web.
     * @property {String} onlineMeetingId - Identifies this meeting among the other online meetings that are scheduled by the organizer.
     *
     *  The online meeting ID is unique within the organizer's list of scheduled online meetings.
     *
     * @property {String} onlineMeetingUri - The online meeting URI.
     *
     *  The online meeting URI is used by participants to join this online meeting.
     *  It can be used to join the meeting:
     *
     *      client.startMeeting({
     *          uri: scheduledMeeting.onlineMeetingUri()
     *      });
     *
     * @property {String} organizerUri - he URI of the online meeting organizer: the person who scheduled the meeting.
     *
     *  Organizers can enumerate or change only the conferences that they organize.
     *
     */
    function ScheduleMeeting(subject, description, expirationTime) {

        //Schedule a Meeting
        client.scheduleMeeting({

            subject: subject,
            description: description,
            expirationTime: expirationTime
            

        }).then(function (meeting) {
           
            alert("Thank you!");   

            
            return client.startMeeting({
                uri: meeting.onlineMeetingUri()
            });
          
            
        }).then(function (conversation) {
            
            //Hide Modal
            $(".modal").hide();
        
            //get Meeting Uri
            $('#meetingUri').val(conversation.meeting.uri());

            //Get Meeting JoinUrl that is used when the online meeting is joined from the web.
            $('#joinUrl').val(conversation.meeting.joinUrl());

            //Start Video Service
            videomeeting = conversation.videoService.start().then(function () {


            });


        //  SignOut();

            
        });

    }


    //Get Presence of Provider
    function SubscribeToUser(providerSIP) {
        
        var query = client.personsAndGroupsManager.createPersonSearchQuery();
        query.text(providerSIP);
        query.limit(1);

        query.getMore().then(function (results) {

            results.forEach(function (result) {         

                    var person = result.result;

                  // alert("Inside results");

                //Get Provider Name
                person.displayName.get().then(function (providerName) {
                    $('#providerName').text("Provider Name: " + providerName);
                });

                //Presence
                person.status.get().then(function (presence) {
                    $('#presenceStatus').text("Presence Status: " + presence);
                });

                //activity
                person.activity.get().then(function (activity) {
                    $('#activity').text("Activity: " + activity);
                });

                //Update Presence Status
                person.status.changed(function (status) {
                    // alert(status);
                    $('#presenceStatus').text("Presence Status: " + status);
                });

                //Update Activity
                person.activity.changed(function (activity) {
                    // alert(status);
                    $('#activity').text("Activity: " + activity);
                });

                person.displayName.subscribe();
                person.status.subscribe();
                person.activity.subscribe();


            });

        }).then(null, function (error) {
            alert('Error:', error);
        });

    }

    //Get Meeting status, Participants and their status
    function GetMeetingDetails(meetingUri)
    {
       

        //Get an instance of Conversation
        var conversation = client.conversationsManager.getConversationByUri(meetingUri);

        //alert(conversation.meeting.state());

        //alert(conversation.participants.size());

        alert(conversation.state());
        $('#lblMeetingState').text(conversation.meeting.state());

       // debugger;
        //Get No of Participants
        $('#lblNoOfParticipant').text(conversation.participants.size());

      

        //Get participants details
        conversation.participants.added(function (participant) {
            participant.role.get().then(function (role) {

                $("#lblPartitcipants").append('<li><b>' + "Joined:" + '</b>&nbsp; ' + participant.person.displayName() + '. Role:' + role + '</li>');

            });
        });

        conversation.participants.removed(function (participant) {
            $("#lblPartitcipants").append('<li><b>' + "Left:" + '</b>&nbsp; ' + participant.person.displayName() + '</li>');
        });

    }

    //Sing-Out
    function SignOut()
    {
        client.signInManager.signOut()
           .then(function () {
               // report the success
              // alert('Signed out');
           }, function (error) {
               // or a failure
               alert(error || 'Cannot sign out');
           });
    }


});

