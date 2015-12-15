
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
        meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:5LOPYAFC";

        //Join the existing meeting using UserName and meetingUris
        JoinConferenceAnonymously(userName, meetingUri);
        
    });

    /* To mute and unmute audio of the conversation
    
   */
    $('.mute, .unmute').click(function () {

       // alert("mute click");
        
        var conversation = client.conversations(0), audio;

        if (conversation) {

            audio = conversation.selfParticipant.audio;

            if (audio.isMuted()) {
                //alert("Muted");
                $(".unmute").addClass("hide");
                $(".mute").removeClass("hide");
            }
            else {
               // alert("Unmuted");
                $(".unmute").removeClass("hide");
                $(".mute").addClass("hide");
            }

            audio.isMuted.set(!audio.isMuted());
        }
    });

    $('.hide-video, .show-video').click(function () {

        var conversation = client.conversations(0), val, vcSelf, dfd;

        if (conv) {
            vcSelf = conv.selfParticipant.video.channels(0);
            val = vcSelf.isStarted();
            vcSelf.isStarted.set(!val);
            if (val) {
                $(".show-video").removeClass("hide");
                $(".hide-video").addClass("hide");
            }
            else {
                $(".show-video").addClass("hide");
                $(".hide-video").removeClass("hide");
            }
            audio.isMuted.set(!audio.isMuted());
        }
    });

    $(".hang-up").click(function () {
        var conv = client.conversations(0), dfd;
        if (conv) {
            dfd = conv.audioService.stop();
        }
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
        alert("Hello");
        // SignIn as anonymous user using conference URI
        client.signInManager.signIn({

            name: userName,
            meeting: meetingUri

        }).then(function () {

           
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

                        //if (newState == 'Connected') {
                        //    if (conversation.participants.size() == 1) {
                        //        p.video.channels(0).stream.source.sink.container(document.getElementById("render-p-window"));
                        //        partcipant.video.channels(0).isStarted.set(true);
                        //    }
                        //    else {
                        //        var partcipant = conversation.participants(0);
                        //        partcipant.video.channels(0).stream.source.sink.container(document.getElementById("render-p-window"));
                        //        partcipant.video.channels(0).isStarted.set(true);

                        //        p.video.channels(0).stream.source.sink.container($(".add-video-container")[0]);
                        //        p.video.channels(0).isStarted.set(true);
                        //    }
                        //}

                         //a convenient place to set the video stream container 
                        if (newState == 'Connected') {
                            p.video.channels(0).stream.state.changed(function (ns, r, os) {
                                onChanged('_participant.video.channels(0).stream.state', ns, r, os);
                            });
                            
                            //alert("Participant Size   " + conversation.participants.size());

                            if (conversation.participants.size() == 1)
                            {                              
                                alert("please wait..");
                                // setTimeout is a workaround
                                setTimeout(function () {
                                    p.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {
                                        setTimeout(function () {
                                            p.video.channels(0).isStarted(true);
                                        }, 0)
                                    });
                                }, 6000);
                            }
                            else
                            {
                               // alert("Participant Size   " + conversation.participants.size());

                                alert("Please  wait...");

                                var partcipant = conversation.participants(0);

                                partcipant.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {

                                partcipant.video.channels(0).isStarted(true);
                                });

                                //setTimeout(function () {
                                   

                                //    partcipant.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {
                                //        setTimeout(function () {
                                //            partcipant.video.channels(0).isStarted(true);
                                //        }, 0)
                                //    });
                                //}, 6000);
                            }
                            
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

                        alert("You have joined the meeting...");

                     

                        $(".av-container").show();
                        $(".render-window").show();

                        selfChannel = conversation.selfParticipant.video.channels(0);
                        selfChannel.stream.source.sink.container.set(document.getElementById("render-self-window")).then(function () {
                            selfChannel.isStarted(true);
                        });

                        //if (conversation.participants.size() > 1) {

                        //    alert("Participant Size   " + conversation.participants.size());

                        //        alert("HI more than one participants");
                        //        // setTimeout is a workaround
                               
                        //        var partcipant = conversation.participants(0);
                        //        partcipant.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {

                        //            partcipant.video.channels(0).isStarted(true);
                        //        });

                        //    //setTimeout(function () {
                                
                                
                        //    //    partcipant.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {
                        //    //        setTimeout(function () {
                        //    //            partcipant.video.channels(0).isStarted(true);
                        //    //        }, 0)
                        //    //    });
                        //    //}, 6000);

                        //}                    
                       
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

        // //Add Participant
        // var participant = conference.createParticipant(client.personsAndGroupsManager.mePerson);
        
        //// participant.isAnonymous = true;

        // conference.participants.add(participant);
        //// alert(conference.onlineMeeting.joinUrl());

        //Start Video Service
        videomeeting = conference.videoService.start().then(function () {

            $(".video-window").show();
            $(".ctr-skypebuttons").show();
            $(".show-video").addClass("hide");
            $(".hide-video").removeClass("hide");
           
            
            alert("Video meeting started....");

        });

    }


});
