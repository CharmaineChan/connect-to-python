(function() {

    "use strict";

    // Signup Form.
    (function() {

        // Vars.
        var $form = document.querySelectorAll('#signup-form')[0],
            $submit = document.querySelectorAll('#signup-form input[type="submit"]')[0],
            $message;

        // Bail if addEventListener isn't supported.
        if (!('addEventListener' in $form))
            return;

        // Message.
        $message = document.createElement('span');
        $message.classList.add('message');
        $form.appendChild($message);

        $message._show = function(type, text) {

            $message.innerHTML = text;
            $message.classList.add(type);
            $message.classList.add('visible');
        };

        $message._hide = function() {
            $message.classList.remove('visible');
        };

        // Events.

        $form.addEventListener('submit', function(event) {

            event.stopPropagation();
            event.preventDefault();

            //Create variables
            var phoneNum = $('#phone').val();
            var phoneCode = false;


            $.ajax({
              type: "GET",
              url: "/cava/afterPhone/messaging.csv",
              dataType: "text",
              success: function(data) {findPhoneCode(data);}
            });


            function findPhoneCode(data) {
              var cols = 2;
              var records = data.split(/\r\n|\n/);
              var vals = records[0].split(',');
              var rows = [];

              //headings var
              var headings = vals.splice(0, cols);
              while(records.length > 0 ) {
                 var t = [];
                  var rec = {};
                  var v = records.shift().split(',');

                  for (var i =0; i < cols; i++) {
                      rec[headings[i]] = v[i];
                  }
                  rows.push(rec);
              }

              //Check phone against form
              rows.forEach(function(rec) {
                if (rec.phone == phoneNum) {
                   phoneCode = rec.code;
                }
              });
            }

            // Hide message.
            $message._hide();

            // Disable submit.
            $submit.disabled = true;


            // Process form.
            window.setTimeout(function() {


                // Reset form.
                $form.reset();

                // Enable submit.
                $submit.disabled = false;

                // Show message.
                if (phoneCode) {
                    $message._show('success','Please display this code to the attendant: ' + phoneCode);
                } else {
                    $message._show('failure','This number is not valid.');
                }

            }, 750);

        });

    })();

})();
