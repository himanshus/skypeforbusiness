/**
 * This script demonstrates how to login
 */
$(function () {
    var client = window.skypeWebApp

    if (window.skypeWebApp.signInManager.state() == "SignedIn") {
        $('.content').html('<div class="signed-in">WelCome  ' +  client.personsAndGroupsManager.mePerson.displayName() + '!' + '</div>');
    }

    // when the user clicks on the "Sign In" button
    $('#btn-sign-in').click(function () {

       
        $(".modal").show();

        // start signing in
        client.signInManager.signIn({
            username: $('#txt-username').val(),
            password: $('#txt-password').val()
        }).then(function () {

            // when the sign in operation succeeds display the user name
            $(".modal").hide();
            console.log('Signed in as ' + client.personsAndGroupsManager.mePerson.displayName());
            $(".menu #sign-in").click();
            $("#anonymous-join").addClass("disable");

        }, function (error) {

            // if something goes wrong in either of the steps above,
            // display the error message
            $(".modal").hide();
            alert("Can't sign in, please check the user name and password.");
            window.location.reload();
            console.log(error || 'Cannot sign in');
        });
    });

    $('#txt-username, #txt-password').keypress(function (evt) {
        if (evt.keyCode == 13) {
            $("#btn-sign-in").click();
        }
    });

    $(".topology-login").click(function () {
        $(".login-options").hide();
        $(".token-sign-in").hide();
        $(".sign-in").show();
    });

    $(".token-login").click(function () {
        $(".login-options").hide();
        $(".sign-in").hide();
        $(".token-sign-in").show();
    });

});
