

/**
 * This script demonstrates how to schedule a metting, also get provider presence status, meeting status
 */

$(function () {
    'use strict';

       var client = window.skypeWebApp;

    //Person SIP to be used to get Presence status
       var providerSIP = "kima078@metio.ms";
       //var providerSIP = "bkumar@mdlive.com";


    /* meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
      
     */
    var meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:J2XIW9SA";

    $('#presenceStatus').click(function () {

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

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();

            alert("Sorry!! Please try again");
        });


    });

    //Get Presence of Provider
    function SubscribeToUser(providerSIP) {
        
        var query = client.personsAndGroupsManager.createPersonSearchQuery();
        query.text(providerSIP);
        query.limit(1);

        query.getMore().then(function (results) {

            results.forEach(function (result) {         

                    var person = result.result;

                  // alert("Inside results");

                //Get Name
                person.displayName.get().then(function (name) {
                    $('#personName').text("Name: " + name);
                });

                //Presence
                person.status.get().then(function (presence) {
                    $('#status').text("Presence Status: " + presence);
                });

                //activity
                person.activity.get().then(function (activity) {
                    $('#activity').text("Activity: " + activity);
                });

                //Update Presence Status
                person.status.changed(function (status) {
                    // alert(status);
                    $('#status').text("Presence Status: " + status);
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

