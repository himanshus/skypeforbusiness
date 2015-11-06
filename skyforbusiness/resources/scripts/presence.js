$(function () {
    'use strict';

    var client = window.skypeWebApp;;

    $('#btnPresence').click(function () {

        SubscribeToUser($('#useruri').val());
    });


    function SubscribeToUser(searchString) {

       // alert(searchString);
        var query = client.personsAndGroupsManager.createPersonSearchQuery();
        query.text(searchString);
        query.limit(1);
        query.getMore().then(function (results) {
            //alert("hii");
            //if (results.length == 0)
            //{

            //    //alert("The contact not found");
            //    throw new Error('The contact not found');
            //}
               

            //// then take any found contact
            //// and pass the found contact down the chain
            //return results[0].result;

            //}).then(function (person) {

            results.forEach(function (result) {
                var person = result.result;



                //Get Display Name
                person.displayName.get().then(function (displayName) {
                    $('#displayName').text("Display Name: " + displayName);
                });

                //Title Name
                person.title.get().then(function (title) {
                    $('#title').text("Title: " + title);
                });

                //Department
                person.department.get().then(function (department) {
                    $('#department').text(" Department: " + department);
                });

                //Company
                person.company.get().then(function (company) {
                    $('#company').text(" Company: " + company);
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

                person.displayName.subscribe();
                person.title.subscribe();
                person.department.subscribe();
                person.company.subscribe();
                person.status.subscribe();
                person.activity.subscribe();
            });
            
        }).then(null, function (error) {
            alert('Error:', error);
        });

    }

});
