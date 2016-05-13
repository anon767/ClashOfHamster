/**
 * Created by rbaum on 13.05.2016.
 */

(function(){
        var canvas = document.getElementById('stage'),
            context = canvas.getContext('2d');
        initialize();

        function initialize() {
            window.addEventListener('resize', resizeCanvas, false);
            resizeCanvas();
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = 400;
        }
    })();
