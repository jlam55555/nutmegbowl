$(function() {

  // set element variables
  var doc = $(document);
  var win = $(window);
  var foot = $("footer");
  
  // accessory functions
  var getPxValue = function(input) {
    return parseInt(input.substring(0, input.length-2));
  };

  // reposition the footer
  var docWidth, docHeight;
  var reposition = function() {
    foot.css({ top: docHeight-foot.height()-getPxValue(foot.css("padding-top"))*2 });
  };
  win.resize(function() {
    var footer = foot;
    $("body").css({ paddingTop: $("header").height() + $("#mainNav").height(), paddingBottom: foot.height() + 2*getPxValue(foot.css("padding-top")) });
    foot.remove();
    docWidth = doc.width() > win.width() ? doc.width() : win.width();
    docHeight = doc.height() > win.height() ? doc.height() : win.height();
    $("body").append(footer);
    reposition();
    $("div#menu").css({ height: win.height() });
  });
  // dropdown code
  $(".dropdown").each(function() {
    $(this).hover(function() {
      $("#dropdown" + $(this).data("dropdown")).css({ top: $("nav#mainNav").height(), left: $(this).position().left });
      $(".dropdown").removeClass("linger");
      $(this).addClass("linger");
      $(".dropdownLinks").addClass("hidden");
      $("#dropdown" + $(this).data("dropdown")).removeClass("hidden");
    }, function() {
      var dropdown = $("#dropdown" + $(this).data("dropdown")), dropdownTab = $(this);
      doc.mousemove(function(event) {
        var x = event.pageX, y = event.pageY, minX = dropdown.position().left, minY = $("nav#mainNav").position().top, maxX = minX + dropdown.width(), maxY = minY + $("nav#mainNav").height() + dropdown.height();
        if(x < minX || x > maxX || y < minY || y > maxY) {
          dropdown.addClass("hidden");
          doc.off("mousemove");
          dropdownTab.removeClass("linger");
        }
      });
    });
  });
  // popups to share
  $("body").on("click", ".shareButtonLink", function() {
    window.open($(this).attr("href"), "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=500");
    return false;
  });
  $("#facebookShareButton").attr({ href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href) });
  $("#twitterShareButton").attr({ href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent("Come visit at Nutmeg Bowl for the best bowling in Fairfield County! " + window.location.href) });
  $("#googlePlusShareButton").attr({ href: "https://plus.google.com/share?url=" + encodeURIComponent(window.location.href) });
  // scrolling menu
  win.scroll(function() {
    if($("body").scrollTop() > $("header").height())
      $("nav#mainNav").addClass("fixed");
    else 
      $("nav#mainNav").removeClass("fixed");
  });
  // clickable .shoutButton for the homepage
  $(".shoutButton").click(function() {
    window.location.href = $(this).data("href");
  });

  win.resize();
  setTimeout(function() {
    win.resize();
  }, 500); 

});
