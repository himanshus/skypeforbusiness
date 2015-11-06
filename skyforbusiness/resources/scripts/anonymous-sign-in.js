
/**
 * This script demonstrates how to Sign in the anonymous user using the meeting URI
 */

$(function () {
    'use strict';

    var client = new Skype.Web.Model.Application;


    $('#name, #meetingUri').keypress(function (evt) {
        if (evt.keyCode == 13) {
            evt.preventDefault();
            $("#btn-sign-in").click();
        }
    });

    // when the user clicks on the "Sign In" button
    $('#btn-sign-in').click(function () {

        $(".modal").show();

        // SignIn as anonymous user using conference URI
        client.signInManager.signIn({
            name: $('#name').val(),
            meeting: $('#meetingUri').val()
        }).then(function () {

            $(".modal").hide();
            alert('Signed in as: ' + client.personsAndGroupsManager.mePerson.displayName());
           

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();
            alert("Can't sign in, please check the meeting URI ");
            window.location.reload();
            console.log(error || 'Cannot sign in');
        });
    });


});
