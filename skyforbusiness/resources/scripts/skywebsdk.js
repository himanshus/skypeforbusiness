


//To create Conference/Meeting URL
function CreateConferenceUri() {

    var client = window.skypeWebApp;

    var conference, videomeeting, meetingUri;

    //Create a Conversation
    conference = client.conversationsManager.createConversation();

    //Start Video Service
    videomeeting = conference.videoService.start().then(function () {

        //Get Conference/Meeting URL
        meetingUri = conference.uri();

        
    });

    return meetingUri;

}