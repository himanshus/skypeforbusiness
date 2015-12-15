
 /* This script demonstrates how to Sign in the anonymous user using the meeting URI
 */
var client;
var conversation;
$(function () {
    'use strict';

    Skype.initialize({
        apiKey: 'SWX-BUILD-SDK',
    }, function (api) {
        client = new api.application();

        // whenever client.state changes, display its value
        window.skypeWebApp.signInManager.state.changed(function (state) {
            //alert(state);

        });
    }, function (err) {
        alert('some error occurred: ' + err);
    });

   


    // when the user clicks on the "Start Conference" button
    $('#joinConference').click(function () {

       
        var userName, meetingUri;
        // $(".modal").show();

        userName = "Anonymous Patient";

        /*Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
       */
        meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:VWDXT1W1";

        //Join the existing meeting using UserName and meetingUris
        JoinConferenceAnonymously(userName, meetingUri);
        
    });

    $('.mute, .unmute').click(function () {

        alert("mute click");
        var conv = client.conversations(0), audio;
        if (conv) {
            audio = conv.selfParticipant.audio;
            if (audio.isMuted()) {
                alert("Muted");
                $(".unmute").addClass("hide");
                $(".mute").removeClass("hide");
            }
            else {
                alert("Unmuted");
                $(".unmute").removeClass("hide");
                $(".mute").addClass("hide");
            }
            audio.isMuted.set(!audio.isMuted());
        }
    });

    $('.hide-video, .show-video').click(function () {
        var conv = client.conversations(0), val, vcSelf, dfd;
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

           

           

              

           

            alert("Start Video Meeting....")
            
            //Join an existing meeting
            JoinExistingConference(meetingUri);

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

                        if (conversation.participants.size() == 1) {
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
                        else {
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

                alert("Inside SelfPartcipnat state changed");

                var selfChannel;
                onChanged('selfParticipant.video.state', newState, reason, oldState);

                if (newState == 'Connected') {

                    alert("You have joined the meeting...");

                    var audio = conversation.selfParticipant.audio;

                    //if (audio.isMuted()){
                    //    $(".unmute").removeClass("hide");
                    //    $(".mute").addClass("hide");
                    //}

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

         var  videomeeting;  

         //Get an instance of Conversation
         conversation = client.conversationsManager.getConversationByUri(meetingUri);

        // //Add Participant
        // var participant = conference.createParticipant(client.personsAndGroupsManager.mePerson);
        
        //// participant.isAnonymous = true;

        // conference.participants.add(participant);
        //// alert(conference.onlineMeeting.joinUrl());

        //Start Video Service
         videomeeting = conversation.videoService.start().then(function () {

            alert("Video Started");

            $(".video-window").show();
            $(".ctr-skypebuttons").show();
            $(".show-video").addClass("hide");
            $(".hide-video").removeClass("hide");
           
            
            alert("Video meeting started....");

        });

    }


});
