<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>Clash of Hamsters</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="client/assets/css/style.css">

        <script>
            function toggle(id) {
                if (document.getElementById) {
                    var mydiv = document.getElementById(id);
                    mydiv.style.display = (mydiv.style.display == 'block' ? 'none' : 'block');
                }
            }
        </script>
        <!-- Only Hide Lock -->
        <script>
            function hide(id) {
                if (document.getElementById) {
                    var mydiv = document.getElementById(id);
                    mydiv.style.display = (mydiv.style.display = 'none');
                }
            }
        </script>

    </head>
    <body style="overflow: hidden">
        <div class="lock" id="lock"
             onclick="toggle('lock'); hide('registration-page'); return false"></div>
        <div class="locker" id="login-page">
            <div class="form">
            <form class="login-form" method="GET" action="game.php">
                        <input type="text" maxlength=20 name="user" id="user" placeholder="username"/>
                        <button>login</button>

                    <p class="link"
                        onclick="hide('login-page'); toggle('registration-page'); return false">Registration</p>
            </form>
            </div>
        </div>

        <div class="locker" id="registration-page" style="display:none">
            <form method="post" action="#">
                <div class="form">
                        <h3>Registrieren</h3>
                        <input name="username_register" id="username_register" type="text" maxlength="20" required pattern="[a-zA-Z0-9]{3,}" placeholder="username"/>
                        <input name="pw_register" id="pw_register" type="password" required pattern="{6,}" placeholder="passwort"/>
                        <input name="pw_repeate_register" id="pw_repeate_register" type="password" required pattern="{6,}" placeholder="passwort wiederholen"/>
                        <input name="mail" id="mail" type="email" required placeholder="email"/>
                        <button>Registrieren</button>
                    <!--VORLÄUFIG EIN LINK ZURÜCK ZUM LOGIN -->
                    <p class="link"
                       onclick="hide('registration-page'); toggle('login-page'); return false">zurück zum login</p>
                </div>
            </form>
        </div>

    </body>

</html>