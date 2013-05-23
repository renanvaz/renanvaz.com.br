<div id="loader" style="background: #FFF">
  <div class="progressbar"></div>
  <img src="media/img/APP/copyright.png" border="0" style="position: absolute; bottom: 5px; left: 5px;" />
</div>

<div id="web">
  <?php echo View::factory('shared/page_install', array('item' => $item)) ?>
</div>  <!-- end of #web -->

<div id="mobile">
  <?php echo View::factory('shared/page_install', array('item' => $item)) ?>
</div>  <!-- end of #web -->