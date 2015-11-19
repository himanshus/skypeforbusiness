
 /* This script demonstrates how to Sign in the anonymous user using the meeting URI
 */

$(function () {
    'use strict';

    var client = window.skypeWebApp;


    // when the user clicks on the "Start Conference" button
    $('#joinConference').click(function () {

        var userName, meetingUri;
        // $(".modal").show();

        userName = "Anonymous Patient";

        /*Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
       */
        meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:YNWFFS4O";

        //Join the existing meeting using UserName and meetingUris
        JoinConferenceAnonymously(userName, meetingUri);
        
    });

    function onChanged(name, newState, reason, oldState) {
        console.log(name + ': %c' + oldState + ' -> ' + newState,
            'color:green;font-weight:bold', 'Reason: ', reason);
    }

    /* Join conference by Patient using meetingUri
      @param {String} userName - Patient User Name
      @param {String} meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
      
     */
    function JoinConferenceAnonymously(userName, meetingUri)
    {
        
        // SignIn as anonymous user using conference URI
        client.signInManager.signIn({

            name: userName,
            meeting: meetingUri

        }).then(function () {

            $(".modal").hide();
            alert('Signed in as: ' + client.personsAndGroupsManager.mePerson.displayName());

           

            var addedListener = client.conversations.added(function (conversation) {
                var chatService, audioService, videoService;

                chatService = conversation.chatService;
                audioService = conversation.audioService;
                videoService = conversation.videoService;

                // participant audio and video state changes
                conversation.participants.added(function (p) {
                    p.video.state.changed(function (newState, reason, oldState) {
                        onChanged('_participant.video.state', newState, reason, oldState);

                        // a convenient place to set the video stream container 
                        if (newState == 'Connected') {
                            p.video.channels(0).stream.state.changed(function (ns, r, os) {
                                onChanged('_participant.video.channels(0).stream.state', ns, r, os);
                            });

                            // setTimeout is a workaround
                            setTimeout(function () {
                                p.video.channels(0).stream.source.sink.container.set(document.getElementById("renderWindow")).then(function () {
                                    setTimeout(function () {
                                        p.video.channels(0).isStarted(true);
                                    }, 0)
                                });
                            }, 6000);
                        }
                    });

                    p.audio.state.changed(function (newState, reason, oldState) {
                        onChanged('_participant.audio.state', newState, reason, oldState);
                    });
                });

                conversation.selfParticipant.audio.state.changed(function (newState, reason, oldState) {
                    onChanged('selfParticipant.audio.state', newState, reason, oldState);
                });

                conversation.selfParticipant.video.state.changed(function (newState, reason, oldState) {
                    var selfChannel;
                    onChanged('selfParticipant.video.state', newState, reason, oldState);

                    if (newState == 'Connected') {
                        // ...or even here
                        selfChannel = conversation.selfParticipant.video.channels(0);
                        selfChannel.stream.source.sink.container.set(document.getElementById("previewWindow")).then(function () {
                            selfChannel.isStarted(true);
                        });
                    }
                });
            });

            alert("Start Video Meeting....")
            
            //Join an existing meeting
            JoinExistingConference(meetingUri);
           

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();
            alert("Can't sign in, please check the meeting URI ");
            window.location.reload();
            console.log(error || 'Cannot sign in');
        });
    }

    /* Join an existing meeting
     @param {String} meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
      we need to get this value from DB or any other storage based on
      storing the meetingUri after scheduleMeeting implementation.
     
    */
    function JoinExistingConference(meetingUri) {

         var conference, videomeeting;  

         //Get an instance of Conversation
         conference = client.conversationsManager.getConversationByUri(meetingUri);

         //Add Participant
         var participant = conference.createParticipant(client.personsAndGroupsManager.mePerson);
        
        // participant.isAnonymous = true;

         conference.participants.add(participant);
        // alert(conference.onlineMeeting.joinUrl());

        //Start Video Service
        videomeeting = conference.videoService.start().then(function () {

            alert("Video meeting started....");


        });

    }


});
