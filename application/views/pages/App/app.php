<!doctype html>
<!-- Conditional comment for mobile ie7 blogs.msdn.com/b/iemobile/ -->
<!--[if IEMobile 7 ]>    <html class="no-js iem7" lang="pt-br" <?php echo Request::current()->action() == 'app' ? 'manifest="./app.manifest"' : '' ?>> <![endif]-->
<!--[if (gt IEMobile 7)|!(IEMobile)]><!--> <html class="no-js" lang="pt-br" <?php echo Request::current()->action() == 'app' ? 'manifest="./app.manifest"' : '' ?>> <!--<![endif]-->

<head>
  <meta charset="utf-8">

  <base href="<?php echo URL::base() ?>" />

  <title><?php echo $item->slug ?> - My Mobile Presentation</title>
  <meta name="description" content=""/>

  <meta name="HandheldFriendly" content="True"/>
  <meta name="MobileOptimized" content="320"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>

  <link rel="shortcut icon" href="media/img/APP/shortcut.ico"/>

  <link rel="apple-touch-icon-precomposed" href="media/img/APP/apple-touch-icon.png"/>

  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black"/>

  <script>(function(){var a;if(navigator.platform==="iPad"){a=window.orientation==0||window.orientation==180?"media/img/APP/startup-tablet-portrait.png":"media/img/APP/startup-tablet-landscape.png"}else{a=window.devicePixelRatio===2?"media/img/APP/startup-retina.png":"media/img/APP/startup.png"}document.write('<link rel="apple-touch-startup-image" href="'+a+'"/>')})()</script>
  <script>(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")</script>

  <meta http-equiv="cleartype" content="on"/>

  <?php Template::compile_css() ?>

  <script>
    var DEVELOPMENT = true;
    var APP_DATA = <?php echo $item->toJSON() ?>;
    var APP_ID = '<?php echo $item->slug ?>';
  </script>
</head>

<body id="loading" class="templateBase">
    <?php echo View::factory('shared/app_info', array('item' => $item)); ?>

    <div id="app">

        <?php if($item->is_restrict): ?>
        <div id="formLogin">
            <form>
                <img src="<?php echo Img::get($item->logo, array('w' => 230, 'h' => 195, 'resize' => true, 'crop' => false)) ?>" />

                <label for="email">Email:</label>
                <input id="email" name="email" size="127" type="email" placeholder="exemplo@email.com.br" required="required" value="" />
                <label for="user_password">Senha:</label>
                <input id="user_password" name="password" size="15" type="password" placeholder="Senha de acesso ao app" required="required" value="" />

                <input class="button" data-disable-with="Carregando..." type="submit" value="Entrar" />
            </form>
        </div>
        <?php endif; ?>

        <aside>
            <div class="masker">
                <div>
                    <header>
                        <img src="media/img/content/logo.png" />
                    </header>

                    <nav>
                        <ul></ul>
                    </nav>
                </div>
            </div>
        </aside>

        <section id="main" role="main">
            <header>
                <button id="btToggle" class="button">Toggle</button>

                <h1></h1>

                <nav>

                </nav>
            </header>
            <div id="hitClickExpand"></div>
        </section>

        <footer>

        </footer>
    </div> <!-- end of #app -->

    <script>
    // Check if a new cache is available on page load.
    window.addEventListener('load', function(e) {

        window.applicationCache.addEventListener('updateready', function(e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                window.applicationCache.swapCache();
                if (confirm('A new version of this application is available. Load it?')) {
                    window.location.reload();
                }
            } else {
            // Manifest didn't changed. Nothing new to server.
            }
        }, false);

    }, false);

    if(!window.DEVELOPMENT){
        if(!(('standalone' in window.navigator) && window.navigator.standalone)){
            document.getElementsByTagName('body')[0].id = ('standalone' in window.navigator) ? 'installMobile' : 'installWeb';
        }
    }else{
        document.getElementsByTagName('body')[0].id = 'standalone';
    }

    document.getElementById('loader').setAttribute('style', 'background: #444 url('+document.querySelector('[rel="apple-touch-startup-image"]').href+') no-repeat center center');
    </script>

    <?php Template::compile_Js(); ?>

    <script>
    var _gaq=[["_setAccount","UA-XXXXX-X"],["_trackPageview"]];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
        g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
        s.parentNode.insertBefore(g,s)}(document,"script"));
    </script>

</body>
</html>
