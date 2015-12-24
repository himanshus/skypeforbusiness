
 /* This script demonstrates how to Sign in the anonymous user using the meeting URI
 */

$(function () {
    'use strict';

    var client;

    var userName, password, meetingUri;
    // $(".modal").show();

    //Provider UserName
    userName = "christinek078@metio.ms";
    //Provider Passwork
    password = "UCW4*fun!";

    /*Get the meetingUri after scheduling the meeting. In real implementation,
   we need to get this value from DB or any other storage based on
   storing the meetingUri after scheduleMeeting implementation.
   */
    meetingUri = "sip:samb078@metio.ms;gruu;opaque=app:conf:focus:id:14UDSD9R";


    // when the user clicks on the "Start Conference" button
    $('#joinConference').click(function () {


        Skype.initialize({
            apiKey: 'SWX-BUILD-SDK',
        }, function (api) {
            client = new api.application();

           

            //Join the existing meeting using UserName password and meetingUris
            JoinConference(userName, password, meetingUri);


        }, function (err) {
            alert('some error occurred: ' + err);
        });

        
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

    /* To Start and stop self video in conversation
   
  */
    $('.hide-video, .show-video').click(function () {

        var conversation = client.conversations(0);
        var videoStatus, selfVideo;

        if (conversation) {

            selfVideo = conversation.selfParticipant.video.channels(0);

            videoStatus = selfVideo.isStarted();

            selfVideo.isStarted.set(!videoStatus);

            if (videoStatus) {
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

    /* To hang-up from the conversation
    */
    $(".hang-up").click(function () {

        var conversation = client.conversations(0), dfd;

        if (conversation) {

            //Stop audio service
            dfd = conversation.audioService.stop();

            //Leave the conversation
            conversation.leave();
        }
    });

    function onChanged(name, newState, reason, oldState) {
        console.log(name + ': %c' + oldState + ' -> ' + newState,
            'color:green;font-weight:bold', 'Reason: ', reason);
    }


    /* Join conference by Provider using meetingUri
      @param {String} userName - Provider User Name
      @param {String} password - Provider Password
      @param {String} meetingUri -  Get the meetingUri after scheduling the meeting. In real implementation,
       we need to get this value from DB or any other storage based on
       storing the meetingUri after scheduleMeeting implementation.
      
     */
    function JoinConference(userName,password, meetingUri)
    {
       
        
        alert("Thank you for joining! Please wait...");


        // SignIn as anonymous user using conference URI
        client.signInManager.signIn({

            username: userName,
            password: password

        }).then(function () {

            $(".modal").hide();

            alert('Signed in as: ' + client.personsAndGroupsManager.mePerson.displayName());

           

            var addedListener = client.conversations.added(function (conversation) {
                var chatService, audioService, videoService;

                chatService = conversation.chatService;
                audioService = conversation.audioService;
                videoService = conversation.videoService;

                // participant added to conversation
                conversation.participants.added(function (participant) {

                    //video state change
                    participant.video.state.changed(function (newState, reason, oldState) {

                        onChanged('_participant.video.state', newState, reason, oldState);


                         //a convenient place to set the video stream container 
                        if (newState == 'Connected') {
                            participant.video.channels(0).stream.state.changed(function (ns, r, os) {
                                onChanged('_participant.video.channels(0).stream.state', ns, r, os);
                            });
                            
                            //alert("Participant Size   " + conversation.participants.size());

                            if (conversation.participants.size() == 1)
                            {                              
                                alert(conversation.participants(0).displayName() + " has just joined the meeting");

                                // setTimeout is a workaround
                                setTimeout(function () {
                                    participant.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {
                                        setTimeout(function () {
                                            participant.video.channels(0).isStarted(true);
                                        }, 0)
                                    });
                                }, 3000);
                            }
                            else
                            {
                               // alert("Participant Size   " + conversation.participants.size());                               
                                 
                                var partcipant = conversation.participants(conversation.participants.size() - 1);

                                alert(partcipant.displayName() + "has just joined the meeting");

                                partcipant.video.channels(0).stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {

                                partcipant.video.channels(0).isStarted(true);
                                });

                             
                            }
                            
                        }
                    });

                    participant.audio.state.changed(function (newState, reason, oldState) {
                        onChanged('_participant.audio.state', newState, reason, oldState);
                    });
                });

                
                conversation.participants.removed(function (participant) {

                    participant.video.state.changed(function (newState, reason, oldState) {

                        onChanged('_participant.video.state', newState, reason, oldState);

                        participant.video.channels(0).stream.source.sink.container(document.getElementById('render-p-window'));
                        participant.video.channels(0).isStarted.set(false);                
                    });

                   
                });

                conversation.selfParticipant.audio.state.changed(function (newState, reason, oldState) {
                    onChanged('selfParticipant.audio.state', newState, reason, oldState);
                });

                //conversation.selfParticipant.video.state.changed(function (newState, reason, oldState) {

                    
                //    alert("Self participant video state changed");
                //    //var selfChannel;
                //    //onChanged('selfParticipant.video.state', newState, reason, oldState);

                //    //if (newState == 'Connected') {

                //    //    alert("You have joined the meeting...");

                     

                //    //    $(".av-container").show();
                //    //    $(".render-window").show();

                //    //    selfChannel = conversation.selfParticipant.video.channels(0);
                //    //    selfChannel.stream.source.sink.container.set(document.getElementById("render-self-window")).then(function () {
                //    //        selfChannel.isStarted(true);
                //    //    });                            
                       
                //    //}
                //});

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

        var conversation, videomeeting;

         //Get an instance of Conversation
        conversation = client.conversationsManager.getConversationByUri(meetingUri);

        var selfChannel, remoteChannel;

         //Start Video
         videomeeting = conversation.videoService.start().then(function () {

            
            $(".video-window").show(); // Show self participant video container
            $(".ctr-skypebuttons").show(); //Show skype buttons
            $(".show-video").addClass("hide"); // hide show-video button by default
            $(".hide-video").removeClass("hide"); //show hide-video button by default

            $(".av-container").show(); //show remote video container
            $(".render-window").show(); 

                    
            alert("Video meeting started....");

            //Show the self participant video
            selfChannel = conversation.selfParticipant.video.channels(0);
            selfChannel.stream.source.sink.container.set(document.getElementById("render-self-window")).then(function () {
                selfChannel.isStarted.set(true);
            });

            

            //If remote participant has already joined the meeting, then remove the video first  and add video
            if (conversation.participants.size() == 1)
            {
                alert("Please wait to see remote participant video. Thank you!!");


                remoteChannel = conversation.participants(0).video.channels(0);


                /*Remove the video as we are adding this same video on partcipant added event. In some cases,
                  remote video is added in partcipant added event. It won't work if we add more video to same
                  content. So better to first remove and then add remote video.
                */
                remoteChannel.stream.source.sink.container(document.getElementById('render-p-window'));
                remoteChannel.isStarted.set(false);

                /*Show the remote video, added the timeout to adjust some time latency. we can remove this in high network bandwidth.
                */
                setTimeout(function () {
                    remoteChannel.stream.source.sink.container.set(document.getElementById("render-p-window")).then(function () {
                        setTimeout(function () {
                            remoteChannel.isStarted.set(true);
                        }, 0)
                    });
                }, 3000);
            }
           

        });

    }


});
